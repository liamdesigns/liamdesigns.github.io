// ===================================
// LIAM DESIGNS - COMPLETE JAVASCRIPT
// With Formspree.io integration & Currency Converter
// =================================== 

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgdzjng';

// ===================================
// CURRENCY CONVERSION SYSTEM
// ===================================

let exchangeRates = {};
let currentCurrency = 'GBP';
let currencySymbols = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
    'AUD': '$',
    'CAD': '$',
    'NZD': '$',
    'CHF': 'Fr',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹',
    'SGD': '$',
    'HKD': '$',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'CZK': 'Kč',
    'ZAR': 'R',
    'BRL': 'R$',
    'MXN': '$'
};

// Fetch exchange rates on page load
async function fetchExchangeRates() {
    try {
        // Using exchangerate-api.com free tier (1,500 requests/month)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
        const data = await response.json();
        exchangeRates = data.rates;
        console.log('Exchange rates loaded successfully');
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Fallback rates if API fails (approximate)
        exchangeRates = {
            'GBP': 1,
            'USD': 1.27,
            'EUR': 1.17,
            'AUD': 1.95,
            'CAD': 1.75,
            'NZD': 2.10,
            'CHF': 1.12,
            'JPY': 190,
            'CNY': 9.10,
            'INR': 106,
            'SGD': 1.70,
            'HKD': 9.90,
            'SEK': 13.50,
            'NOK': 13.80,
            'DKK': 8.70,
            'PLN': 5.10,
            'CZK': 29.50,
            'ZAR': 23.00,
            'BRL': 7.30,
            'MXN': 25.50
        };
    }
}

function convertPrice(gbpPrice, toCurrency) {
    if (toCurrency === 'GBP') return gbpPrice;
    const rate = exchangeRates[toCurrency] || 1;
    return gbpPrice * rate;
}

function formatPrice(price, currency) {
    const symbol = currencySymbols[currency] || currency;
    const convertedPrice = convertPrice(price, currency);
    
    // Always round up to nearest whole number (looks cleaner)
    const roundedPrice = Math.ceil(convertedPrice);
    
    // Format with thousand separators
    return `${symbol}${roundedPrice.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', async function() {
    
    // Load exchange rates first
    await fetchExchangeRates();
    
    // ===================================
    // QUOTE BUILDER SYSTEM
    // ===================================
    
    let selectedPackage = null;
    let selectedExtras = [];
    let extraPages = 0;
    let clientName = '';
    let businessName = '';
    let clientEmail = '';
    let quoteData = null;
    
    const packagePrices = {
    'Basic Package': 95,
    'Standard Package': 160,
    'Premium Package': 260
};

const packageFeatures = {
    'Basic Package': [
        '1 custom landing page',
        'Fully responsive design (desktop, tablet and mobile)',
        'Basic SEO setup',
        'Sticky navbar for easier navigation and better conversions',
        'Contact form with Formspree, favicon, hosting setup and speed optimisation included',
        '2 revisions, delivery in 2 days'
    ],
    'Standard Package': [
        'Everything in the Basic package',
        '2 additional pages (3 pages total)',
        'Logo design included',
        'GA4 analytics setup with GDPR cookie banner',
        'sitemap.xml and robots.txt included',
        '3 revisions, delivery in 3 to 4 days'
    ],
    'Premium Package': [
        'Everything in the Standard package',
        '2 more additional pages (5 pages total)',
        'Full SEO with WCAG friendly accessibility improvements',
        'Priority support',
        '5 revisions, delivery in 4 to 6 days'
    ]
};

    
    const clientNameInput = document.getElementById('clientName');
    const businessNameInput = document.getElementById('businessName');
    const clientEmailInput = document.getElementById('clientEmail');
    const currencySelector = document.getElementById('currencySelector');
    
    // Currency selector change handler
    if (currencySelector) {
        currencySelector.addEventListener('change', function() {
            currentCurrency = this.value;
            updateAllPriceDisplays();
            updateQuote();
        });
    }
    
    if (clientNameInput) {
        clientNameInput.addEventListener('input', function() {
            clientName = this.value.trim();
            updateQuote();
        });
    }
    
    if (businessNameInput) {
        businessNameInput.addEventListener('input', function() {
            businessName = this.value.trim();
            updateQuote();
        });
    }
    
    if (clientEmailInput) {
        clientEmailInput.addEventListener('input', function() {
            clientEmail = this.value.trim();
            updateQuote();
        });
    }
    
    const packageRadios = document.querySelectorAll('input[name="basePackage"]');
    packageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                selectedPackage = {
                    name: this.value,
                    price: parseInt(this.dataset.price)
                };
                updateQuote();
            }
        });
    });
    
    const extrasCheckboxes = document.querySelectorAll('input[name="extras"]');
    extrasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedExtras.push({
                    name: this.value,
                    price: parseInt(this.dataset.price)
                });
            } else {
                selectedExtras = selectedExtras.filter(e => e.name !== this.value);
            }
            updateQuote();
        });
    });
    
    const extraPagesInput = document.getElementById('extraPages');
    if (extraPagesInput) {
        extraPagesInput.addEventListener('input', function() {
            extraPages = parseInt(this.value) || 0;
            updateQuote();
        });
    }
    
    // Flip button handlers for extra cards
    document.querySelectorAll('.flip-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const extraContent = this.closest('.extra-content');
            if (extraContent) {
                extraContent.classList.toggle('flipped');
            }
        });
    });
    
    // Update all price displays on currency change
    function updateAllPriceDisplays() {
        // Update package prices
        document.querySelectorAll('.package-price').forEach(priceEl => {
            const radio = priceEl.closest('.package-option-content').parentElement.querySelector('input[type="radio"]');
            if (radio) {
                const gbpPrice = parseInt(radio.dataset.price);
                priceEl.textContent = formatPrice(gbpPrice, currentCurrency);
            }
        });
        
        // Update extra prices (both front and back faces)
        document.querySelectorAll('.extra-option').forEach(extraOption => {
            const checkbox = extraOption.querySelector('input[type="checkbox"]');
            if (checkbox) {
                const gbpPrice = parseInt(checkbox.dataset.price);
                const priceEls = extraOption.querySelectorAll('.extra-price');
                priceEls.forEach(priceEl => {
                    if (gbpPrice === 0) {
                        priceEl.textContent = 'FREE';
                    } else {
                        priceEl.textContent = formatPrice(gbpPrice, currentCurrency);
                    }
                });
            }
        });
    }
    
    function updateQuote() {
        const breakdown = document.getElementById('quoteBreakdown');
        const total = document.getElementById('quoteTotal');
        const expiryElement = document.getElementById('quoteExpiry');
        const validSection = document.getElementById('quoteValidSection');
        const requestBtn = document.getElementById('requestQuoteBtn');
        
        if (!clientName || !businessName || !clientEmail || !selectedPackage) {
            breakdown.innerHTML = '<p class="quote-empty">Fill in your details and select a package to start</p>';
            total.textContent = formatPrice(0, currentCurrency);
            if (validSection) validSection.style.display = 'none';
            requestBtn.disabled = true;
            return;
        }
        
        let totalPrice = selectedPackage.price;
        let html = '';
        
        html += `<div class="quote-item">
            <span class="quote-item-name">${selectedPackage.name}</span>
            <span class="quote-item-price">${formatPrice(selectedPackage.price, currentCurrency)}</span>
        </div>`;
        
        if (extraPages > 0) {
            const pagesCost = extraPages * 30;
            totalPrice += pagesCost;
            html += `<div class="quote-item">
                <span class="quote-item-name">Extra Pages (×${extraPages})</span>
                <span class="quote-item-price">${formatPrice(pagesCost, currentCurrency)}</span>
            </div>`;
        }
        
        selectedExtras.forEach(extra => {
            totalPrice += extra.price;
            const priceDisplay = extra.price === 0 ? 'FREE' : formatPrice(extra.price, currentCurrency);
            html += `<div class="quote-item">
                <span class="quote-item-name">${extra.name}</span>
                <span class="quote-item-price">${priceDisplay}</span>
            </div>`;
        });
        
        breakdown.innerHTML = html;
        total.textContent = formatPrice(totalPrice, currentCurrency);
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 14);
        expiryElement.textContent = `Valid until ${expiryDate.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        })}`;
        
        if (validSection) validSection.style.display = 'block';
        requestBtn.disabled = false;
        
        quoteData = {
            clientName,
            businessName,
            clientEmail,
            package: selectedPackage,
            extraPages,
            extras: selectedExtras,
            totalPrice,
            totalPriceGBP: totalPrice, // Always store GBP price
            currency: currentCurrency,
            currencySymbol: currencySymbols[currentCurrency],
            convertedTotal: convertPrice(totalPrice, currentCurrency),
            expiryDate
        };
    }
    
    // ===================================
    // REQUEST QUOTE BUTTON (Download + Scroll)
    // ===================================
    
    const requestQuoteBtn = document.getElementById('requestQuoteBtn');
    
    if (requestQuoteBtn) {
        requestQuoteBtn.addEventListener('click', async function() {
            if (!quoteData) return;
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Generating PDF...';
            this.disabled = true;
            
            // Generate and download PDF
            const pdfBlob = await generateQuotePDF(quoteData);
            
            // Trigger download
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Liam_Designs_Quote_${quoteData.businessName.replace(/\s/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Store PDF for form submission
            window.quotePdfBlob = pdfBlob;
            
            // Update button
            this.textContent = '✓ Quote Downloaded!';
            
            // Auto-fill contact form and scroll
            setTimeout(() => {
                autofillContactForm();
                const contactSection = document.getElementById('contact');
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        });
    }
    
    // ===================================
    // PDF GENERATION
    // ===================================
    
    // Helper function to load image as base64
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = src;
        });
    }
    
    async function generateQuotePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        const quoteNumber = `LD-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
        const currentDate = new Date().toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        // Load and add logo
        try {
            const logoImg = await loadImage('logo.png');
            // Header
            doc.setFillColor(26, 26, 26);
            doc.rect(0, 0, pageWidth, 40, 'F');
            
            // Add larger logo (40x20mm - full logo with text)
            // Positioned at 15mm from left, 10mm from top
            doc.addImage(logoImg, 'PNG', 15, 10, 60, 20);
            
        } catch (error) {
            console.error('Failed to load logo, using text only:', error);
            // Fallback to text-only header if logo fails
            doc.setFillColor(26, 26, 26);
            doc.rect(0, 0, pageWidth, 40, 'F');
            
            doc.setTextColor(40, 191, 255);
            doc.setFontSize(28);
            doc.setFont(undefined, 'bold');
            doc.text('Liam Designs', 20, 20);
        }
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(32);
        doc.text('QUOTE', pageWidth - 20, 20, { align: 'right' });
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Quote #: ${quoteNumber}`, pageWidth - 20, 30, { align: 'right' });
        doc.text(`Date: ${currentDate}`, pageWidth - 20, 35, { align: 'right' });
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Prepared for: ${data.clientName}`, 20, 30);
        doc.setFont(undefined, 'normal');
        doc.text(`Business: ${data.businessName}`, 20, 35);
        
        doc.setTextColor(0, 0, 0);
        
        let yPos = 55;
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Quote Breakdown', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        // Base package
        doc.setFont(undefined, 'bold');
        doc.text(data.package.name, 20, yPos);
        doc.text(formatPrice(data.package.price, data.currency), pageWidth - 20, yPos, { align: 'right' });
        yPos += 5;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        const features = packageFeatures[data.package.name];
        features.forEach(feature => {
            doc.text(`• ${feature}`, 25, yPos);
            yPos += 4;
        });
        
        yPos += 5;
        
        if (data.extraPages > 0) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(`Extra Pages (×${data.extraPages})`, 20, yPos);
            doc.text(formatPrice(data.extraPages * 30, data.currency), pageWidth - 20, yPos, { align: 'right' });
            yPos += 5;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.text('Additional custom pages', 25, yPos);
            yPos += 8;
        }
        
        if (data.extras.length > 0) {
            data.extras.forEach(extra => {
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.text(extra.name, 20, yPos);
                const priceText = extra.price === 0 ? 'FREE' : formatPrice(extra.price, data.currency);
                doc.text(priceText, pageWidth - 20, yPos, { align: 'right' });
                yPos += 8;
            });
        }
        
        yPos += 5;
        doc.setLineWidth(0.5);
        doc.line(20, yPos, pageWidth - 20, yPos);
        yPos += 8;
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Total:', 20, yPos);
        doc.setTextColor(0, 174, 239);
        doc.text(formatPrice(data.totalPriceGBP, data.currency), pageWidth - 20, yPos, { align: 'right' });
        doc.setTextColor(0, 0, 0);
        
        // Add currency note if not GBP
        if (data.currency !== 'GBP') {
            yPos += 6;
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Converted from £${data.totalPriceGBP.toFixed(2)} GBP at current exchange rate`, 20, yPos);
            doc.setTextColor(0, 0, 0);
        }
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Quote Valid Until:', 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(data.expiryDate.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }), 60, yPos);
        
        yPos = pageHeight - 30;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Next Steps:', 20, yPos);
        yPos += 5;
        doc.text('1. Review this quote carefully', 20, yPos);
        yPos += 4;
        doc.text('2. Reply with any questions or to confirm', 20, yPos);
        yPos += 4;
        doc.text('3. Once confirmed, I\'ll begin your project', 20, yPos);
        
        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 174, 239);
        doc.text('Contact: hello@liamdesigns.dev', 20, yPos);
        
        return doc.output('blob');
    }
    
    // ===================================
    // AUTO-FILL CONTACT FORM
    // ===================================
    
    function autofillContactForm() {
        if (!quoteData) return;
        
        const contactName = document.getElementById('contactName');
        const contactBusiness = document.getElementById('contactBusiness');
        const contactEmail = document.getElementById('contactEmail');
        const messageField = document.getElementById('message');
        
        if (contactName) contactName.value = quoteData.clientName;
        if (contactBusiness) contactBusiness.value = quoteData.businessName;
        if (contactEmail) contactEmail.value = quoteData.clientEmail;
        
        if (messageField) {
            let message = `Hi, I've generated a quote using your quote builder.\n\n`;
            message += `Package: ${quoteData.package.name} (£${quoteData.package.price})\n`;
            
            if (quoteData.extraPages > 0) {
                message += `Extra Pages: ${quoteData.extraPages} (£${quoteData.extraPages * 30})\n`;
            }
            
            if (quoteData.extras.length > 0) {
                message += `\nOptional Extras:\n`;
                quoteData.extras.forEach(extra => {
                    const price = extra.price === 0 ? 'FREE' : `£${extra.price}`;
                    message += `- ${extra.name} (${price})\n`;
                });
            }
            
            message += `\nTotal: £${quoteData.totalPrice.toFixed(2)}\n\n`;
            message += `My quote PDF is attached. Looking forward to working together!`;
            
            messageField.value = message;
        }
    }
    
    // ===================================
    // FORMSPREE FORM SUBMISSION
    // ===================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const business = document.getElementById('contactBusiness').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !business || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        business: business,
                        email: email,
                        message: message
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.');
                    contactForm.reset();
                    window.quotePdfBlob = null;
                } else {
                    console.error('Formspree error:', data);
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error sending your message. Please try again or email me directly at hello@liamdesigns.dev');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    
    // ===================================
    // MOBILE MENU
    // ===================================
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isActive = navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    
    // ===================================
    // SMOOTH SCROLLING
    // ===================================
    
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    
    // ===================================
    // HEADER SCROLL
    // ===================================
    
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.style.background = 'rgba(10, 14, 23, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
        } else {
            header.style.background = 'rgba(10, 14, 23, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        }
    });
    
    
    // ===================================
    // FAQ ACCORDION
    // ===================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });
            const isActive = item.classList.toggle('active');
            question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
    });
    
    
    // ===================================
    // SCROLL REVEAL
    // ===================================
    
    const revealElements = document.querySelectorAll(
        '.portfolio-item, .process-step, .faq-item, .about-content, .fiverr-mega-content, .quote-step'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });
    
});


// Window resize handler
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (window.innerWidth > 900) {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }, 250);
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
