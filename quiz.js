
/*
    IT 3203 Intro to Web Development
    HTTP Self-Assessment Quiz
    Author: Reina Campbell

    This JavaScript file controls the quiz timer,
    grades answers, displays results, and allows
    users to retake the quiz.
*/

// Get the HTML elements that JavaScript will control
const quizForm = document.getElementById("quizForm");
const timerDisplay = document.getElementById("timer");
const results = document.getElementById("results");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

// Store the correct answers for all 10 questions
const correctAnswers = {
    q1: "a",
    q2: "b",
    q3: "c",
    q4: "b",
    q5: "https",
    q6: "server",
    q7: "tls",
    q8: "true",
    q9: "false",
    q10: ["a", "b", "d"]
};

// Each question is worth 10 points
const pointsPerQuestion = 10;

// Set the time limit to 10 minutes (600 seconds)
const timeLimit = 600;
let timeLeft = timeLimit;

// Track when the quiz starts and whether it was submitted
let startTime = Date.now();
let quizSubmitted = false;

// Convert seconds into minutes and seconds for display
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Add a zero before single-digit seconds
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Update the timer every second
let timerInterval = setInterval(function () {

    // Stop updating the timer after submission
    if (quizSubmitted) {
        return;
    }

    // Calculate how much time has passed
    const elapsedSeconds = Math.floor(
        (Date.now() - startTime) / 1000
    );

    // Subtract elapsed time from the 10-minute limit
    timeLeft = Math.max(0, timeLimit - elapsedSeconds);

    // Display the remaining time on the page
    timerDisplay.textContent =
        "Time Remaining: " + formatTime(timeLeft);

    // Automatically submit when time runs out
    if (timeLeft === 0) {
        gradeQuiz();
    }

}, 1000);

// Check answers when the user clicks Submit Quiz
quizForm.addEventListener("submit", function (event) {

    // Prevent the page from refreshing
    event.preventDefault();

    gradeQuiz();
});

// This function checks all answers and calculates the score
function gradeQuiz() {

    // Prevent the quiz from being graded more than once
    if (quizSubmitted) {
        return;
    }

    quizSubmitted = true;

    // Stop the countdown timer
    clearInterval(timerInterval);

    // Calculate the time spent completing the quiz
    const elapsedSeconds = Math.min(
        timeLimit,
        Math.floor((Date.now() - startTime) / 1000)
    );

    // Start the total score at zero
    let totalScore = 0;

    // Store the feedback for each question
    let feedbackHTML = "";

    // Check each of the 10 questions
    for (let i = 1; i <= 10; i++) {

        const questionName = "q" + i;
        const correctAnswer = correctAnswers[questionName];

        let userAnswer = "";
        let isCorrect = false;

        // Question 10 allows multiple checkbox selections
        if (i === 10) {

            // Collect all selected checkboxes
            const selected = document.querySelectorAll(
                `input[name="${questionName}"]:checked`
            );

            // Store selected checkbox values in an array
            const selectedAnswers = Array.from(selected).map(
                checkbox => checkbox.value
            );

            userAnswer = selectedAnswers.join(", ") || "No answer";

            // All correct options must be selected,
            // and no incorrect options can be selected
            isCorrect =
                selectedAnswers.length === correctAnswer.length &&
                correctAnswer.every(answer =>
                    selectedAnswers.includes(answer)
                );

        } else if (i >= 5 && i <= 7) {

            // Read and clean up fill-in-the-blank answers
            const input = quizForm.elements[questionName];

            userAnswer = input.value.trim().toLowerCase();

            // Ignore capitalization and extra spaces
            isCorrect = userAnswer === correctAnswer;

            if (userAnswer === "") {
                userAnswer = "No answer";
            }

        } else {

            // Find the selected radio button
            const selected = document.querySelector(
                `input[name="${questionName}"]:checked`
            );

            userAnswer = selected ? selected.value : "No answer";

            // Compare the selected value with the correct value
            isCorrect = userAnswer === correctAnswer;
        }

        // Award 10 points for each correct answer
        if (isCorrect) {
            totalScore += pointsPerQuestion;
        }

        // Convert the correct answer into readable text
        let correctAnswerText = "";

        if (i === 10) {
            correctAnswerText =
                "Encrypts data, authenticates websites, " +
                "and protects data integrity";
        } else {
            const answerDescriptions = {
                q1: "Hypertext Transfer Protocol",
                q2: "Transfer web resources between clients and servers",
                q3: "GET",
                q4: "404",
                q5: "HTTPS",
                q6: "Server",
                q7: "TLS",
                q8: "True",
                q9: "False"
            };

            correctAnswerText = answerDescriptions[questionName];
        }

        // Choose green or red styling based on the result
        const resultClass = isCorrect ? "correct" : "incorrect";
        const resultText = isCorrect ? "Correct" : "Incorrect";
        const questionScore = isCorrect ? 10 : 0;

        // Add individual question feedback to the results
        feedbackHTML += `
            <div class="question-result ${resultClass}">
                <h3>Question ${i}: ${resultText}</h3>
                <p>Score: ${questionScore}/10</p>
                <p>Correct Answer: ${correctAnswerText}</p>
            </div>
        `;
    }

    // A score of 70 or higher is passing
    const passed = totalScore >= 70;

    // Choose the correct pass/fail message and color
    const finalResult = passed ? "PASS" : "FAIL";
    const finalClass = passed ? "pass" : "fail";

    // Display overall results and individual feedback
    results.innerHTML = `
        <h2>Your Quiz Results</h2>

        <div class="final-result ${finalClass}">
            <h3>${finalResult}</h3>
            <p>Total Score: ${totalScore}/100</p>
            <p>Time Spent: ${formatTime(elapsedSeconds)}</p>
        </div>

        <h2>Question-by-Question Feedback</h2>
        ${feedbackHTML}
    `;

    // Make the results section visible
    results.hidden = false;

    // Disable quiz inputs after submission
    const inputs = quizForm.querySelectorAll("input");

    inputs.forEach(function (input) {
        input.disabled = true;
    });

    // Disable Submit, but keep Retake available
    submitBtn.disabled = true;

    // Update the timer display
    timerDisplay.textContent =
        "Quiz Completed in " + formatTime(elapsedSeconds);

    // Scroll to the results so the user can see the score
    results.scrollIntoView({ behavior: "smooth" });
}

// Reset the quiz when the Retake Quiz button is clicked
resetBtn.addEventListener("click", function () {

    // Clear all answers from the form
    quizForm.reset();

    // Enable the answer inputs again
    const inputs = quizForm.querySelectorAll("input");

    inputs.forEach(function (input) {
        input.disabled = false;
    });

    // Clear previous results
    results.innerHTML = "";
    results.hidden = true;

    // Enable the Submit button
    submitBtn.disabled = false;

    // Reset the timer and quiz status
    quizSubmitted = false;
    timeLeft = timeLimit;
    startTime = Date.now();

    timerDisplay.textContent = "Time Remaining: 10:00";

    // Restart the countdown timer
    clearInterval(timerInterval);

    timerInterval = setInterval(function () {

        const elapsedSeconds = Math.floor(
            (Date.now() - startTime) / 1000
        );

        timeLeft = Math.max(0, timeLimit - elapsedSeconds);

        timerDisplay.textContent =
            "Time Remaining: " + formatTime(timeLeft);

        // Automatically grade when time runs out
        if (timeLeft === 0) {
            gradeQuiz();
        }

    }, 1000);

    // Return the user to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
});
