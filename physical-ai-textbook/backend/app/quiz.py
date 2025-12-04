"""
Quiz system for background assessment
"""
from typing import List, Dict, Any
from .db import fetch_one, fetch_all, execute

# Background quiz questions (10 questions)
QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "What does ROS stand for?",
        "options": {
            "A": "Robot Operating System",
            "B": "Robotic Orientation Software",
            "C": "Remote Operation System",
            "D": "Real-time Operating System"
        },
        "correct": "A",
        "topic": "ros2"
    },
    {
        "id": 2,
        "question": "Which communication pattern in ROS2 is best for continuous sensor data?",
        "options": {
            "A": "Services",
            "B": "Actions",
            "C": "Topics",
            "D": "Parameters"
        },
        "correct": "C",
        "topic": "ros2"
    },
    {
        "id": 3,
        "question": "What file format does Gazebo use for world definitions?",
        "options": {
            "A": "URDF",
            "B": "SDF",
            "C": "YAML",
            "D": "JSON"
        },
        "correct": "B",
        "topic": "simulation"
    },
    {
        "id": 4,
        "question": "What is the primary purpose of TF2 in ROS2?",
        "options": {
            "A": "Text formatting",
            "B": "File transfer",
            "C": "Coordinate frame transforms",
            "D": "Tensorflow integration"
        },
        "correct": "C",
        "topic": "ros2"
    },
    {
        "id": 5,
        "question": "Which NVIDIA platform is used for photorealistic robot simulation?",
        "options": {
            "A": "CUDA",
            "B": "TensorRT",
            "C": "Isaac Sim",
            "D": "Jetson"
        },
        "correct": "C",
        "topic": "isaac"
    },
    {
        "id": 6,
        "question": "What does VLA stand for in robotics AI?",
        "options": {
            "A": "Virtual Learning Algorithm",
            "B": "Vision-Language-Action",
            "C": "Variable Linear Actuator",
            "D": "Video Learning Architecture"
        },
        "correct": "B",
        "topic": "vla"
    },
    {
        "id": 7,
        "question": "What is domain randomization used for?",
        "options": {
            "A": "Generating random robot names",
            "B": "Improving sim-to-real transfer",
            "C": "Encrypting robot data",
            "D": "Randomizing network ports"
        },
        "correct": "B",
        "topic": "isaac"
    },
    {
        "id": 8,
        "question": "Which QoS setting is best for reliable message delivery?",
        "options": {
            "A": "Best Effort",
            "B": "Volatile",
            "C": "Reliable",
            "D": "Transient"
        },
        "correct": "C",
        "topic": "ros2"
    },
    {
        "id": 9,
        "question": "What does Nav2 provide in ROS2?",
        "options": {
            "A": "Navigation stack",
            "B": "Network configuration",
            "C": "Node authentication",
            "D": "Naming service"
        },
        "correct": "A",
        "topic": "ros2"
    },
    {
        "id": 10,
        "question": "What technique allows training models with limited real data?",
        "options": {
            "A": "Data compression",
            "B": "Synthetic data generation",
            "C": "Data encryption",
            "D": "Data normalization"
        },
        "correct": "B",
        "topic": "isaac"
    }
]


def get_questions() -> List[Dict[str, Any]]:
    """Get all quiz questions (without correct answers)"""
    return [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "topic": q["topic"]
        }
        for q in QUIZ_QUESTIONS
    ]


def calculate_level(score: int, total: int = 10) -> str:
    """Calculate user level based on quiz score"""
    percentage = (score / total) * 100
    if percentage >= 80:
        return "advanced"
    elif percentage >= 50:
        return "intermediate"
    else:
        return "beginner"


async def submit_quiz(user_id: int, answers: Dict[int, str]) -> Dict[str, Any]:
    """Submit quiz answers and calculate score"""
    score = 0
    results = []
    
    for q in QUIZ_QUESTIONS:
        user_answer = answers.get(q["id"], "")
        is_correct = user_answer == q["correct"]
        if is_correct:
            score += 1
        
        # Store response
        await execute(
            "INSERT INTO quiz_responses (user_id, question_id, answer, is_correct) "
            "VALUES ($1, $2, $3, $4)",
            user_id, q["id"], user_answer, is_correct
        )
        
        results.append({
            "question_id": q["id"],
            "correct": is_correct,
            "correct_answer": q["correct"]
        })
    
    level = calculate_level(score)
    
    # Update or insert user level
    existing = await fetch_one(
        "SELECT id FROM user_levels WHERE user_id = $1", 
        user_id
    )
    
    if existing:
        await execute(
            "UPDATE user_levels SET level = $1, quiz_score = $2, updated_at = CURRENT_TIMESTAMP "
            "WHERE user_id = $3",
            level, score, user_id
        )
    else:
        await execute(
            "INSERT INTO user_levels (user_id, level, quiz_score) VALUES ($1, $2, $3)",
            user_id, level, score
        )
    
    return {
        "score": score,
        "total": len(QUIZ_QUESTIONS),
        "level": level,
        "results": results
    }


async def get_user_quiz_results(user_id: int) -> Dict[str, Any]:
    """Get user's quiz results"""
    level = await fetch_one(
        "SELECT level, quiz_score FROM user_levels WHERE user_id = $1",
        user_id
    )
    
    responses = await fetch_all(
        "SELECT question_id, answer, is_correct FROM quiz_responses "
        "WHERE user_id = $1 ORDER BY question_id",
        user_id
    )
    
    return {
        "level": level.get("level") if level else None,
        "score": level.get("quiz_score") if level else None,
        "total": len(QUIZ_QUESTIONS),
        "responses": responses
    }
