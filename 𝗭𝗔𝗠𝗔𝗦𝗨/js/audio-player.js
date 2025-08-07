document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update tab panes
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Pause any playing audio when switching tabs
            pauseAllAudio();
        });
    });

    // Audio player functionality
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    audioPlayers.forEach(player => {
        const playPauseBtn = player.querySelector('.play-pause');
        const audio = player.querySelector('audio');
        const progress = player.querySelector('.timeline-progress');
        const timeDisplay = player.querySelector('.player-time');
        const timeline = player.querySelector('.player-timeline');
        const volumeBtn = player.querySelector('.volume-control');
        
        // Initialize audio duration
        audio.addEventListener('loadedmetadata', function() {
            const duration = formatTime(audio.duration);
            timeDisplay.textContent = `0:00 / ${duration}`;
        });
        
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', function() {
            if (audio.paused) {
                // Pause all other audio players first
                pauseAllAudio();
                audio.play();
                this.setAttribute('aria-pressed', 'true');
                this.querySelector('i').classList.replace('fa-play', 'fa-pause');
                this.querySelector('.sr-only').textContent = 'Pause';
            } else {
                audio.pause();
                this.setAttribute('aria-pressed', 'false');
                this.querySelector('i').classList.replace('fa-pause', 'fa-play');
                this.querySelector('.sr-only').textContent = 'Play';
            }
        });
        
        // Update progress bar
        audio.addEventListener('timeupdate', function() {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const progressPercent = (currentTime / duration) * 100;
            
            progress.style.width = `${progressPercent}%`;
            
            // Update time display
            timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            
            // Update ARIA values for accessibility
            timeline.setAttribute('aria-valuenow', progressPercent);
            timeline.setAttribute('aria-valuetext', `${Math.floor(currentTime)} seconds`);
        });
        
        // Click on timeline to seek
        timeline.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        });
        
        // Volume control
        let savedVolume = 0.7;
        audio.volume = savedVolume;
        
        volumeBtn.addEventListener('click', function() {
            if (audio.volume > 0) {
                savedVolume = audio.volume;
                audio.volume = 0;
                this.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
                this.setAttribute('aria-label', 'Unmute');
            } else {
                audio.volume = savedVolume;
                this.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
                this.setAttribute('aria-label', 'Mute');
            }
        });
        
        // Keyboard accessibility for timeline
        timeline.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                audio.currentTime = Math.max(0, audio.currentTime - 5);
                e.preventDefault();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                e.preventDefault();
            } else if (e.key === 'Home') {
                audio.currentTime = 0;
                e.preventDefault();
            } else if (e.key === 'End') {
                audio.currentTime = audio.duration;
                e.preventDefault();
            }
        });
        
        // Reset player when audio ends
        audio.addEventListener('ended', function() {
            playPauseBtn.setAttribute('aria-pressed', 'false');
            playPauseBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            playPauseBtn.querySelector('.sr-only').textContent = 'Play';
            progress.style.width = '0%';
            audio.currentTime = 0;
            timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
        });
    });
    
    // Helper function to format time (seconds to MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // Function to pause all audio players
    function pauseAllAudio() {
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
            const playBtn = audio.closest('.audio-player').querySelector('.play-pause');
            playBtn.setAttribute('aria-pressed', 'false');
            playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
            playBtn.querySelector('.sr-only').textContent = 'Play';
        });
    }
    
    // Initialize tab focus management for accessibility
    tabPanes.forEach(pane => {
        if (pane.classList.contains('active')) {
            pane.setAttribute('tabindex', '0');
        } else {
            pane.setAttribute('tabindex', '-1');
        }
    });
});