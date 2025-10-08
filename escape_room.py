from flask import Flask, render_template_string, request, jsonify, session
from datetime import datetime
import secrets
import json

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Define your escape rooms (review questions)
ROOMS = [
    {
        "id": 1,
        "title": "The Library of Algorithms",
        "question": "What is the time complexity of binary search?",
        "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        "correct": 1,
        "hint": "Think about how the search space is divided..."
    },
    {
        "id": 2,
        "title": "The Chamber of Data Structures",
        "question": "Which data structure uses LIFO (Last In, First Out)?",
        "options": ["Queue", "Stack", "Tree", "Graph"],
        "correct": 1,
        "hint": "Think of a stack of plates..."
    },
    {
        "id": 3,
        "title": "The Vault of Databases",
        "question": "What does SQL stand for?",
        "options": ["Structured Query Language", "Simple Question Logic", "Standard Query List", "System Quality Language"],
        "correct": 0,
        "hint": "It's about querying databases in a structured way..."
    },
    {
        "id": 4,
        "title": "The Final Gateway",
        "question": "What is the primary purpose of version control systems like Git?",
        "options": ["Code compilation", "Track changes and collaborate", "Debug code", "Run tests"],
        "correct": 1,
        "hint": "Think about teamwork and history..."
    }
]

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Escape Room Research - Room {{ current_room }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .room-title {
            color: #667eea;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .progress {
            background: #e0e0e0;
            height: 8px;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
        }
        .progress-bar {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            height: 100%;
            transition: width 0.3s ease;
        }
        .timer {
            text-align: center;
            font-size: 24px;
            color: #764ba2;
            margin: 20px 0;
            font-weight: bold;
        }
        .question {
            font-size: 20px;
            margin: 30px 0;
            color: #333;
            line-height: 1.6;
        }
        .options {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .option {
            background: #f5f5f5;
            border: 2px solid #e0e0e0;
            padding: 15px 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 16px;
        }
        .option:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
            transform: translateX(5px);
        }
        .hint-btn {
            background: #ffc107;
            color: #333;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 14px;
        }
        .hint {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            border-left: 4px solid #ffc107;
            display: none;
        }
        .feedback {
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
        }
        .correct {
            background: #d4edda;
            color: #155724;
        }
        .incorrect {
            background: #f8d7da;
            color: #721c24;
        }
        .next-btn {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            display: none;
        }
        .stats {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .stat-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="room-title">{{ room.title }}</h1>
            <div class="progress">
                <div class="progress-bar" style="width: {{ progress }}%"></div>
            </div>
            <div>Room {{ current_room }} of {{ total_rooms }}</div>
        </div>
        
        <div class="timer" id="timer">Time: 00:00</div>
        
        <div class="question">{{ room.question }}</div>
        
        <div class="options" id="options">
            {% for option in room.options %}
            <div class="option" onclick="selectAnswer({{ loop.index0 }})">
                {{ option }}
            </div>
            {% endfor %}
        </div>
        
        <button class="hint-btn" onclick="showHint()">💡 Need a hint?</button>
        <div class="hint" id="hint">{{ room.hint }}</div>
        
        <div class="feedback" id="feedback"></div>
        <button class="next-btn" id="nextBtn" onclick="nextRoom()">Next Room →</button>
    </div>
    
    <script>
        let startTime = Date.now();
        let answered = false;
        
        // Timer
        setInterval(() => {
            let elapsed = Math.floor((Date.now() - startTime) / 1000);
            let minutes = Math.floor(elapsed / 60);
            let seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
        
        function showHint() {
            document.getElementById('hint').style.display = 'block';
        }
        
        function selectAnswer(index) {
            if (answered) return;
            answered = true;
            
            let timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            fetch('/submit', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    room_id: {{ room.id }},
                    answer: index,
                    time_spent: timeSpent
                })
            })
            .then(r => r.json())
            .then(data => {
                let feedback = document.getElementById('feedback');
                feedback.style.display = 'block';
                
                if (data.correct) {
                    feedback.className = 'feedback correct';
                    feedback.textContent = '🎉 Correct! You escaped this room!';
                } else {
                    feedback.className = 'feedback incorrect';
                    feedback.textContent = '❌ Not quite right. The correct answer was: ' + data.correct_answer;
                }
                
                document.getElementById('nextBtn').style.display = 'block';
                
                // Disable options
                document.querySelectorAll('.option').forEach(opt => {
                    opt.style.cursor = 'not-allowed';
                    opt.style.opacity = '0.6';
                });
            });
        }
        
        function nextRoom() {
            window.location.href = '/room';
        }
    </script>
</body>
</html>
"""

RESULTS_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Escape Room Complete!</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 700px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .title {
            color: #667eea;
            font-size: 32px;
            margin-bottom: 10px;
        }
        .stats {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .stat-item {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e0e0e0;
            font-size: 18px;
        }
        .stat-item:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .value {
            color: #667eea;
            font-weight: bold;
        }
        .restart-btn {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin-top: 20px;
        }
        .download-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🎉 Congratulations!</h1>
            <p>You've completed all the escape rooms!</p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <span class="label">Total Time:</span>
                <span class="value">{{ total_time }}</span>
            </div>
            <div class="stat-item">
                <span class="label">Rooms Completed:</span>
                <span class="value">{{ rooms_completed }}</span>
            </div>
            <div class="stat-item">
                <span class="label">Correct Answers:</span>
                <span class="value">{{ correct_answers }} / {{ rooms_completed }}</span>
            </div>
            <div class="stat-item">
                <span class="label">Average Time per Room:</span>
                <span class="value">{{ avg_time }}</span>
            </div>
        </div>
        
        <h3>Time Breakdown by Room:</h3>
        <div class="stats">
            {% for result in results %}
            <div class="stat-item">
                <span class="label">Room {{ result.room_id }}:</span>
                <span class="value">{{ result.time_display }} {% if result.correct %}✓{% else %}✗{% endif %}</span>
            </div>
            {% endfor %}
        </div>
        
        <button class="download-btn" onclick="downloadData()">📊 Download Research Data (JSON)</button>
        <button class="restart-btn" onclick="window.location.href='/'">🔄 Start New Session</button>
    </div>
    
    <script>
        function downloadData() {
            fetch('/download')
                .then(r => r.json())
                .then(data => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `escape_room_data_${Date.now()}.json`;
                    a.click();
                });
        }
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    session.clear()
    session['current_room'] = 0
    session['results'] = []
    return render_template_string("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Escape Room Research</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    background: white;
                    border-radius: 15px;
                    padding: 60px;
                    max-width: 600px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                h1 {
                    color: #667eea;
                    font-size: 36px;
                    margin-bottom: 20px;
                }
                p {
                    color: #555;
                    font-size: 18px;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .start-btn {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 20px 40px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 20px;
                    text-decoration: none;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔓 Escape Room Challenge</h1>
                <p>Welcome to our gamification research study!</p>
                <p>You'll navigate through {{ room_count }} themed rooms, each containing a review question. Your time and answers will be recorded for research purposes.</p>
                <p>Ready to begin your adventure?</p>
                <a href="/room" class="start-btn">Start Challenge</a>
            </div>
        </body>
        </html>
    """, room_count=len(ROOMS))

@app.route('/room')
def room():
    current = session.get('current_room', 0)
    
    if current >= len(ROOMS):
        return results()
    
    room_data = ROOMS[current]
    progress = ((current) / len(ROOMS)) * 100
    
    return render_template_string(
        HTML_TEMPLATE,
        room=room_data,
        current_room=current + 1,
        total_rooms=len(ROOMS),
        progress=progress
    )

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    room_id = data['room_id']
    answer = data['answer']
    time_spent = data['time_spent']
    
    room = ROOMS[room_id - 1]
    correct = answer == room['correct']
    
    # Store results
    if 'results' not in session:
        session['results'] = []
    
    session['results'].append({
        'room_id': room_id,
        'question': room['question'],
        'answer_index': answer,
        'correct': correct,
        'time_spent': time_spent
    })
    
    session['current_room'] = session.get('current_room', 0) + 1
    session.modified = True
    
    return jsonify({
        'correct': correct,
        'correct_answer': room['options'][room['correct']]
    })

@app.route('/results')
def results():
    results_data = session.get('results', [])
    
    if not results_data:
        return redirect('/')
    
    total_time = sum(r['time_spent'] for r in results_data)
    correct_answers = sum(1 for r in results_data if r['correct'])
    avg_time = total_time / len(results_data) if results_data else 0
    
    # Format times
    def format_time(seconds):
        mins = seconds // 60
        secs = seconds % 60
        return f"{mins:02d}:{secs:02d}"
    
    for r in results_data:
        r['time_display'] = format_time(r['time_spent'])
    
    return render_template_string(
        RESULTS_TEMPLATE,
        results=results_data,
        total_time=format_time(total_time),
        rooms_completed=len(results_data),
        correct_answers=correct_answers,
        avg_time=format_time(int(avg_time))
    )

@app.route('/download')
def download():
    results_data = session.get('results', [])
    return jsonify({
        'timestamp': datetime.now().isoformat(),
        'total_rooms': len(ROOMS),
        'completed_rooms': len(results_data),
        'results': results_data,
        'summary': {
            'total_time_seconds': sum(r['time_spent'] for r in results_data),
            'correct_answers': sum(1 for r in results_data if r['correct']),
            'accuracy': sum(1 for r in results_data if r['correct']) / len(results_data) if results_data else 0
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Escape Room Research App...")
    print("📊 Navigate to: http://127.0.0.1:5000")
    print("⏱️  Time tracking enabled for each room")
    app.run(debug=True, port=5000)