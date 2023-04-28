from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meetings.db'
db = SQLAlchemy(app)

class Meeting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    start_time = db.Column(db.String(10), nullable=False)
    end_time = db.Column(db.String(10), nullable=False)
    participants = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"<Meeting {self.topic}>"

db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/meetings', methods=['GET'])
def get_meetings():
    meetings = Meeting.query.all()
    meeting_list = []
    for meeting in meetings:
        meeting_list.append({
            "id": meeting.id,
            "topic": meeting.topic,
            "date": meeting.date,
            "start_time": meeting.start_time,
            "end_time": meeting.end_time,
            "participants": meeting.participants.split(',')
        })
    return jsonify(meeting_list)

@app.route('/meetings', methods=['POST'])
def add_meeting():
    data = request.json
    new_meeting = Meeting(
        topic=data['topic'],
        date=data['date'],
        start_time=data['start_time'],
        end_time=data['end_time'],
        participants=','.join(data['participants'])
    )
    db.session.add(new_meeting)
    db.session.commit()
    return jsonify({'message': 'Meeting added'})

@app.route('/meetings/<int:meeting_id>', methods=['PUT'])
def update_meeting(meeting_id):
    meeting = Meeting.query.get_or_404(meeting_id)
    data = request.json
    meeting.topic = data['topic']
    meeting.date = data['date']
    meeting.start_time = data['start_time']
    meeting.end_time = data['end_time']
    meeting.participants = ','.join(data['participants'])
    db.session.commit()
    return jsonify({'message': 'Meeting updated'})

@app.route('/meetings/<int:meeting_id>', methods=['DELETE'])
def delete_meeting(meeting_id):
    meeting = Meeting.query.get_or_404(meeting_id)
    db.session.delete(meeting)
    db.session.commit()
    return jsonify({'message': 'Meeting deleted'})

if __name__ == '__main__':
    app.run(debug=True)
