// Main JavaScript for Mamunur Rashid eShop Payment Page
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const openPaymentFormBtn = document.getElementById('openPaymentForm');
    const closePaymentFormBtn = document.getElementById('closePaymentForm');
    const paymentFormModal = document.getElementById('paymentFormModal');
    const showPaymentOptionsBtn = document.getElementById('showPaymentOptions');
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.getElementById('closeModal');
    const completePaymentBtns = document.querySelectorAll('.payment-button');
    const successModal = document.getElementById('successModal');
    const successCloseButtons = document.querySelectorAll('.success-close');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const sendMoneyOptions = document.getElementById('sendMoneyOptions');
    const paymentOptions = document.getElementById('paymentOptions');
    const copyButtons = document.querySelectorAll('.copy-number');
    const successDetails = document.getElementById('successDetails');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const amountInput = document.getElementById('amount');
    const directPaymentLinks = document.querySelectorAll('.direct-payment-link');
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const copyWhatsappLinkBtn = document.getElementById('copyWhatsappLink');

    // Function to open payment form modal - used by both click and touch events
    function openPaymentForm(e) {
        // Prevent default behavior to avoid keyboard popup
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        paymentFormModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const modalContent = paymentFormModal.querySelector('.modal-content');
        modalContent.style.animation = 'modalFadeIn 0.4s';
        
        // Return false to prevent any default behavior
        return false;
    }
    
    // Open payment form modal - add both click and touchstart events for mobile compatibility
    if (openPaymentFormBtn) {
        // Since we're now using a div instead of a button, ensure it's not focusable in a way that triggers keyboard
        openPaymentFormBtn.setAttribute('role', 'button');
        openPaymentFormBtn.setAttribute('tabindex', '0');
        
        // Add click event for desktop
        openPaymentFormBtn.addEventListener('click', function(e) {
            return openPaymentForm(e);
        });
        
        // Add touchstart event for mobile
        openPaymentFormBtn.addEventListener('touchstart', function(e) {
            return openPaymentForm(e);
        });
        
        // Add touchend event for mobile to prevent any default behavior
        openPaymentFormBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        // Add keyboard support for accessibility
        openPaymentFormBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                return openPaymentForm(e);
            }
        });
    }

    // Close payment form modal
    if (closePaymentFormBtn) {
        closePaymentFormBtn.addEventListener('click', function() {
            paymentFormModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Show payment options
    if (showPaymentOptionsBtn) {
        showPaymentOptionsBtn.addEventListener('click', function() {
            // Validate form
            if (!validateForm()) {
                return;
            }

            paymentFormModal.classList.remove('show');
            paymentModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Show the correct payment options based on selected method
            const selectedMethod = paymentMethodSelect.value;
            showSelectedPaymentOptions(selectedMethod);
        });
    }

    // Close payment options modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            paymentModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Tab switching functionality
    if (tabItems.length > 0) {
        tabItems.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                tabItems.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                let contentToShow;
                
                if (tabId === 'send-money') {
                    contentToShow = document.getElementById('sendMoneyOptions');
                } else if (tabId === 'payment') {
                    contentToShow = document.getElementById('paymentOptions');
                }
                
                if (contentToShow) {
                    contentToShow.classList.add('active');
                }
            });
        });
    }

    // Direct payment links - open directly in new tab without checking transaction ID
    if (directPaymentLinks.length > 0) {
        directPaymentLinks.forEach(link => {
            // No validation needed - just let the link open directly
        });
    }

    // Complete payment buttons (including the ones in all tabs)
    const completeSendMoneyBtn = document.getElementById('completeSendMoneyPayment');
    const completeDirectPaymentBtn = document.getElementById('completeDirectPayment');

    // Function to handle payment completion
    function handlePaymentCompletion(paymentMethod, transactionIdInput) {
        // Validate transaction ID
        if (!transactionIdInput.value.trim()) {
            transactionIdInput.style.borderColor = 'var(--error-color)';
            alert('অনুগ্রহ করে ট্রানজেকশন আইডি লিখুন');
            return;
        }
        
        transactionIdInput.style.borderColor = '';
        const transactionId = transactionIdInput.value;
        
        // Show success message
        paymentModal.classList.remove('show');
        
        // Get payment details
        const name = nameInput.value;
        const amount = amountInput.value;
        const phone = phoneInput.value;
        
        // Set values in success modal
        document.getElementById('successName').textContent = name;
        document.getElementById('successPhone').textContent = phone;
        document.getElementById('successAmount').textContent = amount;
        document.getElementById('successMethod').textContent = getPaymentMethodName(paymentMethod);
        document.getElementById('successTransactionId').textContent = transactionId;
        
        // Show the success modal
        successModal.classList.add('show');
        
        // Create share data for different platforms
        const shareData = {
            name: name,
            phone: phone,
            amount: amount,
            method: getPaymentMethodName(paymentMethod),
            transactionId: transactionId
        };
        
        // Store share data in session storage for sharing buttons to use
        sessionStorage.setItem('paymentShareData', JSON.stringify(shareData));
    }

    // Send Money payment completion
    if (completeSendMoneyBtn) {
        completeSendMoneyBtn.addEventListener('click', function() {
            const transactionIdInput = document.getElementById('sendMoneyTransactionId');
            handlePaymentCompletion('send-money', transactionIdInput);
        });
    }

    // Card payment completion - removed
    
    // Direct payment completion
    if (completeDirectPaymentBtn) {
        completeDirectPaymentBtn.addEventListener('click', function() {
            const transactionIdInput = document.getElementById('paymentTransactionId');
            handlePaymentCompletion('payment', transactionIdInput);
        });
    }

    // Close success modal
    successCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            successModal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset form
            document.getElementById('paymentForm').reset();
        });
    });

    // Share buttons functionality
    const shareWhatsappBtn = document.getElementById('shareWhatsapp');
    const shareMessengerBtn = document.getElementById('shareMessenger');
    const shareImoBtn = document.getElementById('shareImo');
    const shareSmsBtn = document.getElementById('shareSms');

    // WhatsApp share - Updated to use specific number
    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener('click', function() {
            const shareData = JSON.parse(sessionStorage.getItem('paymentShareData'));
            if (shareData) {
                const whatsappMessage = `নাম: ${shareData.name}%0A` +
                                       `ফোন: ${shareData.phone}%0A` +
                                       `পরিমাণ: ${shareData.amount} টাকা%0A` +
                                       `পেমেন্ট মেথড: ${shareData.method}%0A` +
                                       `ট্রানজেকশন আইডি: ${shareData.transactionId}`;
                // Open WhatsApp with specific number
                window.open(`https://wa.me/8801609020997?text=${whatsappMessage}`, '_blank');
            }
        });
    }

    // Copy WhatsApp link
    if (copyWhatsappLinkBtn) {
        copyWhatsappLinkBtn.addEventListener('click', function() {
            const shareData = JSON.parse(sessionStorage.getItem('paymentShareData'));
            if (shareData) {
                const whatsappMessage = `নাম: ${shareData.name}\n` +
                                       `ফোন: ${shareData.phone}\n` +
                                       `পরিমাণ: ${shareData.amount} টাকা\n` +
                                       `পেমেন্ট মেথড: ${shareData.method}\n` +
                                       `ট্রানজেকশন আইডি: ${shareData.transactionId}`;
                
                // Copy to clipboard
                const tempInput = document.createElement('textarea');
                tempInput.value = whatsappMessage;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Change button text temporarily
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> কপি হয়েছে';
                
                // Reset button text after delay
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    }

    // Messenger share - Updated with specific link
    if (shareMessengerBtn) {
        shareMessengerBtn.addEventListener('click', function() {
            const shareData = JSON.parse(sessionStorage.getItem('paymentShareData'));
            if (shareData) {
                const messengerMessage = `নাম: ${shareData.name}%0A` +
                                        `ফোন: ${shareData.phone}%0A` +
                                        `পরিমাণ: ${shareData.amount} টাকা%0A` +
                                        `পেমেন্ট মেথড: ${shareData.method}%0A` +
                                        `ট্রানজেকশন আইডি: ${shareData.transactionId}`;
                window.open(`https://m.me/sah.imran.31?hash=AbbLjFZgT2qaWVdr&source=qr_link_share&text=${messengerMessage}`, '_blank');
            }
        });
    }

    // IMO share
    if (shareImoBtn) {
        shareImoBtn.addEventListener('click', function() {
            const shareData = JSON.parse(sessionStorage.getItem('paymentShareData'));
            if (shareData) {
                // IMO doesn't have a direct web share link, so we'll use a fallback to copy the text
                const imoMessage = `নাম: ${shareData.name}\n` +
                                  `ফোন: ${shareData.phone}\n` +
                                  `পরিমাণ: ${shareData.amount} টাকা\n` +
                                  `পেমেন্ট মেথড: ${shareData.method}\n` +
                                  `ট্রানজেকশন আইডি: ${shareData.transactionId}`;
                
                // Copy to clipboard
                const tempInput = document.createElement('textarea');
                tempInput.value = imoMessage;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                alert('পেমেন্ট তথ্য কপি করা হয়েছে। IMO অ্যাপে পেস্ট করুন।');
                
                // Try to open IMO app if possible
                try {
                    window.open('imo://', '_blank');
                } catch (e) {
                    // If IMO app can't be opened, just show the alert
                }
            }
        });
    }

    // SMS share
    if (shareSmsBtn) {
        shareSmsBtn.addEventListener('click', function() {
            const shareData = JSON.parse(sessionStorage.getItem('paymentShareData'));
            if (shareData) {
                const smsMessage = `নাম: ${shareData.name}, ` +
                                  `ফোন: ${shareData.phone}, ` +
                                  `পরিমাণ: ${shareData.amount} টাকা, ` +
                                  `পেমেন্ট মেথড: ${shareData.method}, ` +
                                  `ট্রানজেকশন আইডি: ${shareData.transactionId}`;
                
                // Use SMS URI scheme
                window.open(`sms:?&body=${encodeURIComponent(smsMessage)}`, '_blank');
            }
        });
    }

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Update hidden select value
            paymentMethodSelect.value = this.getAttribute('data-method');
        });
    });

    // Copy number to clipboard
    copyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const number = this.getAttribute('data-number');
            
            // Create temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = number;
            document.body.appendChild(tempInput);
            
            // Select and copy
            tempInput.select();
            document.execCommand('copy');
            
            // Remove temporary element
            document.body.removeChild(tempInput);
            
            // Change button text temporarily
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> কপি হয়েছে';
            
            // Reset button text after delay
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === paymentFormModal) {
            paymentFormModal.classList.remove('show');
            document.body.style.overflow = '';
        }
        if (e.target === paymentModal) {
            paymentModal.classList.remove('show');
            document.body.style.overflow = '';
        }
        if (e.target === successModal) {
            successModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Helper functions
    function validateForm() {
        let isValid = true;
        
        // Check name
        if (!nameInput.value.trim()) {
            nameInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            nameInput.style.borderColor = '';
        }
        
        // Check phone
        if (!phoneInput.value.trim()) {
            phoneInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            phoneInput.style.borderColor = '';
        }
        
        // Check amount
        if (!amountInput.value.trim() || isNaN(amountInput.value) || amountInput.value <= 0) {
            amountInput.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            amountInput.style.borderColor = '';
        }
        
        if (!isValid) {
            alert('অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন');
        }
        
        return isValid;
    }

    function showSelectedPaymentOptions(method) {
        // Hide all payment options
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show selected payment options
        if (method === 'send-money') {
            sendMoneyOptions.classList.add('active');
            tabItems[0].classList.add('active');
            tabItems[1].classList.remove('active');
        } else if (method === 'payment') {
            paymentOptions.classList.add('active');
            tabItems[1].classList.add('active');
            tabItems[0].classList.remove('active');
        }
    }

    function getPaymentMethodName(method) {
        if (method === 'send-money') {
            return 'Send Money';
        } else if (method === 'payment') {
            return 'Payment';
        } else if (method === 'card') {
            return 'Card';
        }
        return method;
    }
});
