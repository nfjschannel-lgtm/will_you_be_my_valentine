/* ============================================
   TERMINAL VALENTINE - JAVASCRIPT
   Interactive behavior for the Valentine site
   ============================================ */

// ===== WAIT FOR PAGE TO FULLY LOAD =====
// This ensures all HTML elements exist before we try to interact with them
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== GET REFERENCES TO HTML ELEMENTS =====
    // Store references to elements we'll need to interact with
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionState = document.getElementById('question-state');
    const successState = document.getElementById('success-state');
    const hoverMessage = document.getElementById('hover-message');
    const progressSection = document.getElementById('progress-section');
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const progressStatus = document.getElementById('progress-status');
    const successMainBlocks = document.querySelectorAll('.success-main');
    const bridgertonLetter = document.getElementById('bridgerton-letter');
    const letterEnvelope = document.getElementById('letter-envelope');
    const letterContent = document.getElementById('letter-content');
    const letterClose = document.getElementById('letter-close');

    // Tracks whether the secret cat easter egg has already been triggered
    let catEasterEggTriggered = false;
    
    // ===== CONFIGURATION =====
    // Funny messages to display when hovering over the No button
    const hoverMessages = [
        "Are you sure? This might make Dean super sad...",
        "Tiny warning: saying no could dim one very big smile.",
        "Careful, this button is linked directly to Dean's heart.",
        "Whistledown would be SHOCKED if you pressed that.",
        "Gentle reminder: you are very, very loved.",
        "Ffion, the universe is quietly voting for YES.",
        "Rumour has it this button was never meant to be clicked.",
        "Maybe try the green happy button instead? 💚"
    ];
    
    // Counter to track how many times No button has been clicked
    let noClickCount = 0;
    
    // Different funny texts for the No button after each click
    const noButtonTexts = [
        "No, thank you",
        "Are you really sure?",
        "Maybe that was a slip...",
        "What if we try yes instead?",
        "My heart is running away 😳",
        "Button temporarily confused, please press YES"
    ];

    // ===== YES BUTTON CLICK HANDLER =====
    // What happens when someone clicks "Yes"
    yesBtn.addEventListener('click', function() {
        // Hide the question, show the success message
        questionState.classList.remove('active');
        successState.classList.add('active');

        // Reset and start build animation
        startBuildProgress();

        // Gentle vibration on supported devices
        if (navigator.vibrate) {
            navigator.vibrate([80, 40, 80]);
        }
        
        // Add background celebration pulse
        document.body.classList.add('celebrate');
        
        // Optional: Play a sound effect (uncomment if you add a sound file)
        // playSound('success.mp3');
    });

    // ===== NO BUTTON CLICK HANDLER =====
    // What happens when someone tries to click "No"
    noBtn.addEventListener('click', function() {
        noClickCount++;
        
        // Strategy 1: Shake the button (first 2 clicks)
        if (noClickCount <= 2) {
            noBtn.classList.add('shake');
            // Remove shake class after animation completes
            setTimeout(() => {
                noBtn.classList.remove('shake');
            }, 500);
            
            // Change button text to something funny
            if (noButtonTexts[noClickCount]) {
                noBtn.innerHTML = noButtonTexts[noClickCount];
            }
        }
        // Strategy 2: Make button run away (clicks 3-5)
        else if (noClickCount <= 5) {
            moveButtonAway();
            noBtn.innerHTML = noButtonTexts[noClickCount] || "😱 It's escaping!";
        }
        // Strategy 3: Just disable it (click 6+)
        else {
            noBtn.innerHTML = "🚫 Nice try";
            noBtn.disabled = true;
            noBtn.style.opacity = '0.5';
            noBtn.style.cursor = 'not-allowed';
            hoverMessage.textContent = "// The No button has been deprecated";
        }
    });

    // ===== NO BUTTON HOVER HANDLER =====
    // Show funny messages when hovering over the No button
    noBtn.addEventListener('mouseenter', function() {
        // Pick a random message from our array
        const randomMessage = hoverMessages[Math.floor(Math.random() * hoverMessages.length)];
        hoverMessage.textContent = randomMessage;
    });

    // Clear message when mouse leaves
    noBtn.addEventListener('mouseleave', function() {
        hoverMessage.textContent = "";
    });

    // ===== MOVE BUTTON AWAY FUNCTION =====
    // Makes the No button jump to a random position
    function moveButtonAway() {
        // Get the button's current position
        const buttonRect = noBtn.getBoundingClientRect();
        const containerRect = questionState.getBoundingClientRect();
        
        // Calculate safe movement range (stay within container)
        const maxX = containerRect.width - buttonRect.width;
        const maxY = containerRect.height - buttonRect.height;
        
        // Generate random x and y coordinates
        const randomX = Math.random() * maxX - maxX / 2;
        const randomY = Math.random() * maxY - maxY / 2;
        
        // Apply the movement using CSS custom properties
        noBtn.style.setProperty('--x', randomX);
        noBtn.style.setProperty('--y', randomY);
        noBtn.classList.add('move-away');
        
        // Reset position after a moment so it can move again
        setTimeout(() => {
            noBtn.classList.remove('move-away');
            noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 300);
    }

    // ===== CONFETTI SYSTEM =====
    // Creates a celebration confetti effect when Yes is clicked
    
    function startConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas to full screen size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Array to store all confetti pieces
        const confettiPieces = [];
        const confettiCount = 200; // Number of confetti pieces
        
        // Colors for confetti (matching our theme)
        const colors = ['#ff6b9d', '#00d9ff', '#bd93f9', '#50fa7b', '#ffb86c'];
        
        // ===== CONFETTI PIECE CLASS =====
        // Each piece of confetti is an object with properties
        class Confetti {
            constructor() {
                this.x = Math.random() * canvas.width; // Random horizontal position
                this.y = Math.random() * canvas.height - canvas.height; // Start above screen
                this.size = Math.random() * 8 + 5; // Random size
                this.speedY = Math.random() * 3 + 2; // Falling speed
                this.speedX = Math.random() * 2 - 1; // Horizontal drift
                this.color = colors[Math.floor(Math.random() * colors.length)]; // Random color
                this.rotation = Math.random() * 360; // Random starting rotation
                this.rotationSpeed = Math.random() * 10 - 5; // Rotation speed
            }
            
            // Update confetti position and rotation
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;
                
                // If confetti falls off screen, don't update anymore
                if (this.y > canvas.height) {
                    return false; // Signal this piece is done
                }
                return true; // Still active
            }
            
            // Draw the confetti piece
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;
                
                // Draw as a rectangle (you can change to circles or hearts)
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                
                ctx.restore();
            }
        }
        
        // Create all confetti pieces
        for (let i = 0; i < confettiCount; i++) {
            confettiPieces.push(new Confetti());
        }
        
        // ===== ANIMATION LOOP =====
        // This function runs continuously to animate confetti
        function animateConfetti() {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Track if any confetti is still active
            let stillActive = false;
            
            // Update and draw each piece of confetti
            confettiPieces.forEach((piece, index) => {
                if (piece.update()) {
                    piece.draw();
                    stillActive = true;
                } else {
                    // Remove pieces that have fallen off screen
                    confettiPieces.splice(index, 1);
                }
            });
            
            // Continue animation if confetti is still falling
            if (stillActive) {
                requestAnimationFrame(animateConfetti);
            } else {
                // Clear canvas when done
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        // Start the animation
        animateConfetti();
    }

    // ===== BUILD PROGRESS BAR ANIMATION =====
    function startBuildProgress() {
        if (!progressFill || !progressPercent || !progressStatus) return;

        // Ensure main success content is hidden at the start
        successMainBlocks.forEach(el => el.classList.add('hidden-success'));

        let current = 0;
        const steps = [
            { percent: 18, text: 'Checking: does Ffion know how wonderful she is? 💘' },
            { percent: 42, text: 'Gathering all the reasons Dean is obsessed with your smile...' },
            { percent: 73, text: 'Filling this Valentine with extra softness and cuddles 💕' },
            { percent: 92, text: 'Adding final sparkle, kisses, and happy-heart energy ✨', },
            { percent: 100, text: 'Ready! Opening the part where Dean melts completely...' }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                current = step.percent;
                progressFill.style.width = current + '%';
                progressPercent.textContent = current + '%';
                progressStatus.textContent = step.text;

                if (current === 100) {
                    // Brief pause, then reveal main success content
                    setTimeout(() => {
                        progressSection.style.display = 'none';
                        successMainBlocks.forEach(el => el.classList.remove('hidden-success'));

                        // Start big celebration once "build" is done
                        startConfetti();
                        startHearts();
                        startCats();
                    }, 700);
                }
            }, index * 900);
        });
    }

    // ===== FLOATING HEART BURST =====
    // Extra cute floating hearts when Yes is clicked
    function startHearts() {
        const heartCount = 40;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('span');
            heart.classList.add('floating-heart');
            heart.textContent = Math.random() > 0.5 ? '💖' : '💘';

            // Random left offset and slight delay for a more natural burst
            const offset = (Math.random() - 0.5) * 260; // -130px to 130px
            const delay = Math.random() * 0.8; // 0–0.8s stagger
            const size = 22 + Math.random() * 16; // 22–38px

            heart.style.setProperty('--x-offset', `${offset}px`);
            heart.style.fontSize = `${size}px`;
            heart.style.left = '50%';
            heart.style.animationDelay = `${delay}s`;

            document.body.appendChild(heart);

            // Clean up after animation
            setTimeout(() => {
                heart.remove();
            }, 3500 + delay * 1000);
        }

        // Fire a couple more mini-heart bursts for extra drama
        setTimeout(() => spawnMiniHearts(18), 1200);
        setTimeout(() => spawnMiniHearts(18), 2400);

        // Stop the background pulse after a little while
        setTimeout(() => {
            document.body.classList.remove('celebrate');
        }, 7000);
    }

    // Smaller follow‑up heart bursts
    function spawnMiniHearts(count) {
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('span');
            heart.classList.add('floating-heart');
            heart.textContent = Math.random() > 0.5 ? '💖' : '💘';

            const offset = (Math.random() - 0.5) * 320; // wider spread
            const delay = Math.random() * 0.6;
            const size = 18 + Math.random() * 14;

            heart.style.setProperty('--x-offset', `${offset}px`);
            heart.style.fontSize = `${size}px`;
            heart.style.left = `${20 + Math.random() * 60}vw`;
            heart.style.animationDelay = `${delay}s`;

            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 3200 + delay * 1000);
        }
    }

    // ===== DANCING CAT GIFS =====
    // Spawns dancing cat GIFs all over the screen
    function startCats() {
        const cat = document.createElement('img');
        cat.classList.add('dancing-cat');
        cat.src = 'cat-dance.gif'; // Add this GIF file to your project root
        cat.alt = 'Happy dancing cat';

        // One bigger cat near the bottom centre-ish of the screen
        const topPercent = 55;   // slightly above bottom
        const leftPercent = 50;  // centred
        const delay = 0.1;

        cat.style.top = `${topPercent}vh`;
        cat.style.left = `${leftPercent}vw`;
        cat.style.animationDelay = `${delay}s`;

        document.body.appendChild(cat);

        // Make the cat clickable for a tiny secret easter egg
        cat.addEventListener('click', () => {
            if (catEasterEggTriggered) return;
            catEasterEggTriggered = true;

            // Little excited pop for the cat
            cat.classList.add('cat-surprised');

            // Extra heart burst just for the cat touch
            spawnMiniHearts(22);

            // Cute secret note from the valentine cat
            const note = document.createElement('div');
            note.classList.add('cat-note');
            note.innerHTML = '🐾 Secret kitty report:<br>Ffion pet the cat. Dean\'s heart fully melted.';

            document.body.appendChild(note);

            // Fade the note in and then back out
            setTimeout(() => {
                note.classList.add('visible');
            }, 10);

            setTimeout(() => {
                note.classList.remove('visible');
                setTimeout(() => {
                    note.remove();
                }, 500);
            }, 3800);
        });

        // Remove cat after a while so it doesn't stay forever
        setTimeout(() => {
            cat.remove();
            // Once the main celebration fades, reveal the Bridgerton letter
            showBridgertonLetter();
        }, 9000);
    }

    // ===== BRIDGERTON LETTER LOGIC =====
    function showBridgertonLetter() {
        if (!bridgertonLetter) return;
        bridgertonLetter.classList.remove('hidden-letter');
        bridgertonLetter.classList.add('visible-letter');
    }

    if (letterEnvelope && bridgertonLetter) {
        letterEnvelope.addEventListener('click', function() {
            bridgertonLetter.classList.add('open');
        });
    }

    if (letterClose && bridgertonLetter) {
        letterClose.addEventListener('click', function(event) {
            event.stopPropagation();
            bridgertonLetter.classList.add('fade-out');
        });
    }
    
    // ===== HANDLE WINDOW RESIZE =====
    // Make sure canvas stays full screen if window is resized
    window.addEventListener('resize', function() {
        const canvas = document.getElementById('confetti-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // ===== OPTIONAL: KEYBOARD SHORTCUTS =====
    // Fun Easter egg: Press 'Y' for yes, 'N' for no
    document.addEventListener('keydown', function(event) {
        if (questionState.classList.contains('active')) {
            if (event.key.toLowerCase() === 'y') {
                yesBtn.click();
            } else if (event.key.toLowerCase() === 'n') {
                noBtn.click();
            }
        }
    });

    // ===== CONSOLE MESSAGE =====
    // Sweet little note for anyone peeking behind the scenes
    console.log('%c💖 Hi Ffion (or secret helper)! 💖', 'color: #ff6b9d; font-size: 20px; font-weight: bold;');
    console.log('%cSomeone spent a lot of care making this just for you.', 'color: #00d9ff; font-size: 14px;');
    console.log('%cYou are very loved, very adored, and very special.', 'color: #bd93f9; font-size: 14px;');
    console.log('%cTiny hint: you can press Y or N on your keyboard.', 'color: #50fa7b; font-size: 14px;');

});

// ===== HELPER FUNCTION: PLAY SOUND (OPTIONAL) =====
// Uncomment and use this if you want to add sound effects
/*
function playSound(filename) {
    const audio = new Audio(filename);
    audio.volume = 0.5; // 50% volume
    audio.play().catch(error => {
        console.log('Audio play failed:', error);
    });
}
*/
