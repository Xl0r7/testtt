
document.addEventListener('DOMContentLoaded', function() {
    // True Glass Magnifier Effect
    class TrueGlassMagnifier {
        constructor(targetElement) {
            this.target = targetElement;
            this.glassElement = null;
            this.clonedText = null;
            this.mousePosition = { x: 0, y: 0 };
            this.isActive = false;
            
            // Responsive glass sizing and magnification
            const isMobile = window.innerWidth <= 768;
            this.glassWidth = isMobile ? 70 : 90;
            this.glassHeight = isMobile ? 35 : 45;
            this.magnificationPower = isMobile ? 1.6 : 1.8;
            
            this.init();
        }
        
        init() {
            this.createGlass();
            this.bindEvents();
        }
        
        createGlass() {
            this.glassElement = document.createElement('div');
            this.glassElement.className = 'true-glass-magnifier';
            
            // Create cloned text inside glass
            this.clonedText = this.target.cloneNode(true);
            this.clonedText.className = 'magnified-text-clone';
            
            this.glassElement.innerHTML = `
                <div class="glass-content">
                    ${this.clonedText.outerHTML}
                </div>
                <div class="glass-reflection"></div>
                <div class="glass-highlight"></div>
            `;
            
            document.body.appendChild(this.glassElement);
        }
        
        bindEvents() {
            // Mouse events for desktop
            this.target.addEventListener('mouseenter', (e) => this.activate(e));
            this.target.addEventListener('mouseleave', () => this.deactivate());
            this.target.addEventListener('mousemove', (e) => this.updatePosition(e));
            
            // Touch events for mobile
            this.target.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.activate(e.touches[0]);
            });
            this.target.addEventListener('touchend', () => {
                this.deactivate();
            });
            this.target.addEventListener('touchmove', (e) => {
                e.preventDefault();
                this.updatePosition(e.touches[0]);
            });
        }
        
        activate(e) {
            this.isActive = true;
            this.glassElement.classList.add('active');
            this.hideOriginalText();
            this.updatePosition(e);
        }
        
        deactivate() {
            this.isActive = false;
            this.glassElement.classList.remove('active');
            this.showOriginalText();
        }
        
        hideOriginalText() {
            // Create a mask to hide the text area under the glass
            if (!this.textMask) {
                this.textMask = document.createElement('div');
                this.textMask.className = 'text-mask';
                document.body.appendChild(this.textMask);
            }
        }
        
        showOriginalText() {
            if (this.textMask) {
                this.textMask.remove();
                this.textMask = null;
            }
        }
        
        updatePosition(e) {
            if (!this.isActive) return;
            
            const rect = this.target.getBoundingClientRect();
            
            // Constrain to horizontal movement only, keep vertical position fixed
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = rect.top + (rect.height / 2); // Fixed to center of title
            
            // Constrain horizontal movement within title bounds
            const minX = rect.left;
            const maxX = rect.right - this.glassWidth;
            const constrainedX = Math.max(minX, Math.min(maxX, this.mousePosition.x - this.glassWidth / 2));
            
            // Position glass centered on cursor horizontally, fixed vertically
            const x = constrainedX;
            const y = this.mousePosition.y - this.glassHeight / 2;
            
            this.glassElement.style.left = `${x}px`;
            this.glassElement.style.top = `${y}px`;
            
            // Update mask position to hide original text
            if (this.textMask) {
                this.textMask.style.left = `${x}px`;
                this.textMask.style.top = `${y}px`;
            }
            
            // Calculate text positioning inside glass
            const glassContent = this.glassElement.querySelector('.glass-content');
            const clonedText = this.glassElement.querySelector('.magnified-text-clone');
            
            // Position the cloned text to show the magnified area under cursor
            const relativeX = this.mousePosition.x - rect.left;
            const relativeY = this.mousePosition.y - rect.top;
            
            // Responsive magnification power - lower zoom for better letter visibility
            const isMobile = window.innerWidth <= 768;
            const adjustedMagnification = isMobile ? 1.6 : 1.8;
            
            // Calculate offset to center the area under cursor in the glass
            const offsetX = (this.glassWidth / 2) - (relativeX * adjustedMagnification);
            const offsetY = (this.glassHeight / 2) - (relativeY * adjustedMagnification);
            
            clonedText.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${adjustedMagnification})`;
            clonedText.style.transformOrigin = '0 0';
        }
    }
    
    // Initialize the true glass magnifier
    const heroTitle = document.querySelector('.hero-title');
    const glassMagnifier = new TrueGlassMagnifier(heroTitle);

    // Custom dropdown functionality
    const customSelect = document.querySelector('.custom-select');
    const selectTrigger = customSelect.querySelector('.select-trigger');
    const customOptions = customSelect.querySelector('.custom-options');
    const customOptionsList = customOptions.querySelectorAll('.custom-option');
    const hiddenSelect = customSelect.querySelector('select');

    // Toggle dropdown
    selectTrigger.addEventListener('click', function() {
        customSelect.classList.toggle('open');
        selectTrigger.classList.toggle('active');
        customOptions.classList.toggle('show');
    });

    // Handle option selection
    customOptionsList.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const text = this.textContent;
            
            // Update trigger text
            selectTrigger.querySelector('span').textContent = text;
            
            // Update hidden select
            hiddenSelect.value = value;
            
            // Update selected state
            customOptionsList.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Close dropdown
            customSelect.classList.remove('open');
            selectTrigger.classList.remove('active');
            customOptions.classList.remove('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
            selectTrigger.classList.remove('active');
            customOptions.classList.remove('show');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission handler
    document.querySelector('.ticket-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ticketType = hiddenSelect.value;
        const quantity = document.querySelector('input[type="number"]').value;
        
        // Simple validation
        if (quantity < 1 || quantity > 10) {
            alert('Please select a quantity between 1 and 10.');
            return;
        }
        
        // Simulate payment process
        alert(`Proceeding to payment for ${quantity} ${ticketType} ticket(s)!`);
    });
});
