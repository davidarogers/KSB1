class FlashcardApp {
    constructor() {
        this.currentCategory = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userProgress = {
            correct: [],
            needReview: []
        };
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.showPasswordScreen();
    }

    bindEvents() {
        // Password screen
        document.getElementById('password-submit').addEventListener('click', () => this.checkPassword());
        document.getElementById('password-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkPassword();
        });

        // Category selection
        document.querySelectorAll('.btn-category').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCategory(e.target.dataset.category));
        });

        // Flashcard navigation
        document.getElementById('show-answer').addEventListener('click', () => this.showAnswer());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('back-to-category').addEventListener('click', () => this.backToCategory());
        document.getElementById('restart-category').addEventListener('click', () => this.restartCategory());
        
        // Self-assessment
        document.getElementById('got-it-right').addEventListener('click', () => this.markAsCorrect());
        document.getElementById('need-review').addEventListener('click', () => this.markForReview());
    }

    showPasswordScreen() {
        this.showScreen('password-screen');
        document.getElementById('password-input').focus();
    }

    checkPassword() {
        const password = document.getElementById('password-input').value;
        const errorElement = document.getElementById('password-error');
        
        if (password === ADMIN_PASSWORD) {
            this.showLandingScreen();
            errorElement.textContent = '';
        } else {
            errorElement.textContent = 'Incorrect password. Please try again.';
            document.getElementById('password-input').value = '';
            document.getElementById('password-input').focus();
        }
    }

    showLandingScreen() {
        this.showScreen('landing-screen');
    }

    selectCategory(category) {
        this.currentCategory = category;
        
        if (category === 'all') {
            this.currentQuestions = [
                ...questionsData.knowledge,
                ...questionsData.skills,
                ...questionsData.behaviour
            ].sort((a, b) => a.id - b.id);
        } else {
            this.currentQuestions = [...questionsData[category]].sort((a, b) => a.id - b.id);
        }
        
        this.currentQuestionIndex = 0;
        this.userProgress = { correct: [], needReview: [] };
        this.showFlashcardScreen();
    }

    showFlashcardScreen() {
        this.showScreen('flashcard-screen');
        this.updateFlashcard();
    }

    updateFlashcard() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Update progress counter
        document.getElementById('question-counter').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.currentQuestions.length}`;
        
        // Update category name
        document.getElementById('category-name').textContent = 
            this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1);
        
        // Update question side
        document.getElementById('question-ref').textContent = `Ref: ${question.ref}`;
        document.getElementById('question-text').textContent = question.question;
        
        // Update answer side
        document.getElementById('answer-ref').textContent = `Ref: ${question.ref}`;
        document.getElementById('question-recap').textContent = question.question;
        document.getElementById('answer-text').textContent = question.answer;
        
        // Reset to question side
        this.showQuestionSide();
        
        // Update next button text
        const nextBtn = document.getElementById('next-question');
        if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
            nextBtn.textContent = 'Finish Category';
        } else {
            nextBtn.textContent = 'Next Question';
        }
    }

    showQuestionSide() {
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('question-side').style.display = 'flex';
        document.getElementById('answer-side').style.display = 'none';
    }

    showAnswer() {
        document.getElementById('flashcard').classList.add('flipped');
        setTimeout(() => {
            document.getElementById('question-side').style.display = 'none';
            document.getElementById('answer-side').style.display = 'flex';
        }, 300);
    }

    markAsCorrect() {
        const questionId = this.currentQuestions[this.currentQuestionIndex].id;
        if (!this.userProgress.correct.includes(questionId)) {
            this.userProgress.correct.push(questionId);
        }
        // Remove from review list if it was there
        this.userProgress.needReview = this.userProgress.needReview.filter(id => id !== questionId);
    }

    markForReview() {
        const questionId = this.currentQuestions[this.currentQuestionIndex].id;
        if (!this.userProgress.needReview.includes(questionId)) {
            this.userProgress.needReview.push(questionId);
        }
        // Remove from correct list if it was there
        this.userProgress.correct = this.userProgress.correct.filter(id => id !== questionId);
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.updateFlashcard();
        } else {
            this.showCompletionSummary();
        }
    }

    showCompletionSummary() {
        const correct = this.userProgress.correct.length;
        const needReview = this.userProgress.needReview.length;
        const total = this.currentQuestions.length;
        
        alert(`Category Complete!\n\nCorrect: ${correct}\nNeed Review: ${needReview}\nNot Assessed: ${total - correct - needReview}`);
        
        this.backToCategory();
    }

    backToCategory() {
        this.showLandingScreen();
    }

    restartCategory() {
        if (confirm('Are you sure you want to restart this category?')) {
            this.currentQuestionIndex = 0;
            this.userProgress = { correct: [], needReview: [] };
            this.updateFlashcard();
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardApp();
});