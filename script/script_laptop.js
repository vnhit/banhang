// script_laptop.js - Script đồng bộ universal cho Index và Laptop pages (Đã loại bỏ giỏ hàng)

// ============ HỆ THỐNG QUẢN LÝ CHUNG ============
window.ShopManager = window.ShopManager || {
    
    // Hiển thị thông báo
    showNotification: function(message, type = 'success') {
        // Xóa thông báo cũ nếu có
        const existingNotification = document.querySelector('.shop-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'shop-notification';
        notification.textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Thêm CSS animation nếu chưa có
        if (!document.querySelector('#shop-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'shop-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },
    
    // Format giá tiền
    formatPrice: function(priceText) {
        const price = priceText.replace(/[^\d]/g, '');
        return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
    }
};

console.log('Universal script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // ============ PHÁT HIỆN TRANG HIỆN TẠI ============
    const isLaptopPage = document.querySelector('.brand-section') !== null;
    const isIndexPage = !isLaptopPage;
    
    console.log('Page type:', isLaptopPage ? 'Laptop Page' : 'Index Page');
    
    // ============ CHỨC NĂNG CHUNG CHO CẢ 2 TRANG ============
    
    // 1. XỬ LÝ FORM ĐỊA CHỈ
    const addressFormTrigger = document.getElementById('adress-form');
    const addressForm = document.querySelector('.adress-form');
    const addressClose = document.getElementById('adress-close');
    
    if (addressFormTrigger && addressForm) {
        addressFormTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            addressForm.style.display = 'flex';
            console.log('Address form opened');
        });
    }
    
    if (addressClose && addressForm) {
        addressClose.addEventListener('click', function() {
            addressForm.style.display = 'none';
            console.log('Address form closed');
        });
    }
    
    // Đóng form khi click background
    if (addressForm) {
        addressForm.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
    
    // 2. XỬ LÝ DROPDOWN MENU
    const menuItems = document.querySelectorAll('.menu-bar-content > ul > li');
    
    menuItems.forEach(function(item) {
        const submenu = item.querySelector('.submenu');
        
        if (submenu) {
            item.addEventListener('mouseenter', function() {
                submenu.style.display = 'block';
            });
            
            item.addEventListener('mouseleave', function() {
                submenu.style.display = 'none';
            });
        }
    });
    
    // ============ CHỨC NĂNG CHO TRANG INDEX ============
    if (isIndexPage) {
        console.log('Initializing Index page features');
        
        // Xử lý tìm kiếm - chuyển hướng
        const searchInput = document.querySelector('input[placeholder="Bạn tìm gì?"]');
        const searchIcon = document.querySelector('.fa-magnifying-glass');
        
        function redirectToSearch() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                const targetUrl = '../left/laptops.html?search=' + encodeURIComponent(searchTerm);
                window.location.href = targetUrl;
            } else {
                window.ShopManager.showNotification('Vui lòng nhập từ khóa tìm kiếm!', 'warning');
            }
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    redirectToSearch();
                }
            });
        }
        
        if (searchIcon) {
            searchIcon.addEventListener('click', function(e) {
                e.preventDefault();
                redirectToSearch();
            });
        }
        
        // Xử lý click thương hiệu - chuyển hướng
        const brandLinks = document.querySelectorAll('.brand-link');
        brandLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const brand = this.getAttribute('data-brand');
                let url = '../left/laptops.html';
                if (brand && brand !== 'all') {
                    url += '?brand=' + brand;
                }
                window.location.href = url;
            });
        });
        
        // Hiệu ứng hover cho các thẻ sản phẩm trên trang index
        const productCards = document.querySelectorAll('.product-card, .category-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            });
        });
    }
    
    // ============ CHỨC NĂNG CHO TRANG LAPTOP ============
    if (isLaptopPage) {
        console.log('Initializing Laptop page features');
        
        const brandLinks = document.querySelectorAll('.brand-link');
        const brandSections = document.querySelectorAll('.brand-section');
        
        console.log('Found brand links:', brandLinks.length);
        console.log('Found brand sections:', brandSections.length);
        
        // Xử lý URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const brandParam = urlParams.get('brand');
        const searchParam = urlParams.get('search');
        
        // ============ CHỨC NĂNG HIỂN THỊ SẢN PHẨM ============
        function hideAllSections() {
            brandSections.forEach(function(section) {
                section.style.display = 'none';
            });
        }
        
        function showAllSections() {
            brandSections.forEach(function(section) {
                section.style.display = 'block';
            });
            
            // Reset tất cả sản phẩm về hiển thị
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.display = 'block';
            });
        }
        
        function showBrandSection(brandName) {
            hideAllSections();
            const targetSection = document.getElementById(brandName);
            if (targetSection) {
                targetSection.style.display = 'block';
                console.log('Showing section:', brandName);
            }
        }
        
        // ============ XỬ LÝ THƯƠNG HIỆU ============
        brandLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const brand = this.getAttribute('data-brand');
                
                // Xóa active class
                brandLinks.forEach(function(l) {
                    l.classList.remove('active');
                });
                this.classList.add('active');
                
                if (brand === 'all') {
                    showAllSections();
                } else {
                    showBrandSection(brand);
                }
            });
        });
        
        // ============ XỬ LÝ NÚT "THÊM VÀO GIỎ HÀNG" (CHỈ HIỆU ỨNG) ============
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.product-name').textContent.trim();
                
                // Thêm loading state
                const originalText = this.textContent;
                this.textContent = 'Đang thêm...';
                this.disabled = true;
                this.style.backgroundColor = '#ff9800';
                
                // Hiển thị thông báo
                window.ShopManager.showNotification(`Đã thêm ${productName} vào giỏ hàng!`);
                
                // Reset button sau 1.5 giây
                setTimeout(() => {
                    this.style.backgroundColor = '#4CAF50';
                    this.textContent = 'Đã thêm!';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = '';
                        this.textContent = originalText;
                        this.disabled = false;
                    }, 1000);
                }, 1000);
            });
        });
        
        // ============ XỬ LÝ TÌM KIẾM ============
        const searchInput = document.querySelector('input[placeholder="Bạn tìm gì?"]');
        const searchIcon = document.querySelector('.fa-magnifying-glass');
        
        function performSearch(searchTerm) {
            if (!searchTerm || searchTerm.trim() === '') {
                showAllSections();
                return;
            }
            
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            showAllSections();
            let hasResults = false;
            
            document.querySelectorAll('.product-card').forEach(function(card) {
                const name = card.querySelector('.product-name').textContent.toLowerCase();
                const desc = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
                
                if (name.includes(lowerSearchTerm) || desc.includes(lowerSearchTerm)) {
                    card.style.display = 'block';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Ẩn các section không có sản phẩm nào hiển thị
            brandSections.forEach(section => {
                const visibleProducts = section.querySelectorAll('.product-card[style*="block"], .product-card:not([style*="none"])');
                if (visibleProducts.length === 0) {
                    section.style.display = 'none';
                }
            });
            
            if (!hasResults) {
                window.ShopManager.showNotification('Không tìm thấy sản phẩm phù hợp!', 'warning');
            }
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = this.value.trim();
                    performSearch(query);
                }
            });
            
            // Tìm kiếm real-time
            searchInput.addEventListener('input', function() {
                const query = this.value.trim();
                if (query === '') {
                    showAllSections();
                }
            });
        }
        
        if (searchIcon) {
            searchIcon.addEventListener('click', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                performSearch(query);
            });
        }
        
        // ============ HIỆU ỨNG VÀ TƯƠNG TÁC ============
        // Hover effect cho product cards
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            });
        });
        
        // Lazy loading cho hình ảnh
        const images = document.querySelectorAll('.product-image');
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Chỉ áp dụng hiệu ứng fade nếu hình ảnh chưa được load
                        if (!img.dataset.loaded) {
                            img.style.opacity = '0';
                            img.style.transition = 'opacity 0.3s ease';
                            
                            // Nếu hình ảnh đã có sẵn (cached), hiển thị ngay
                            if (img.complete && img.naturalWidth > 0) {
                                img.style.opacity = '1';
                                img.dataset.loaded = 'true';
                            } else {
                                img.onload = function() {
                                    this.style.opacity = '1';
                                    this.dataset.loaded = 'true';
                                };
                            }
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                // Đảm bảo hình ảnh đã có sẵn không bị ẩn
                if (img.complete && img.naturalWidth > 0) {
                    img.style.opacity = '1';
                    img.dataset.loaded = 'true';
                } else {
                    imageObserver.observe(img);
                }
            });
        }
        
        // Format giá tiền
        const priceElements = document.querySelectorAll('.product-price');
        priceElements.forEach(priceEl => {
            const formattedPrice = window.ShopManager.formatPrice(priceEl.textContent);
            priceEl.textContent = formattedPrice;
        });
        
        // ============ XỬ LÝ URL PARAMETERS KHI LOAD TRANG ============ 
        if (brandParam) {
            showBrandSection(brandParam);
            const targetLink = document.querySelector('[data-brand="' + brandParam + '"]');
            if (targetLink) {
                brandLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
            }
        } else if (searchParam) {
            if (searchInput) {
                searchInput.value = searchParam;
                performSearch(searchParam);
            }
        } else {
            showAllSections();
        }
    }
    
    // ============ RESPONSIVE MENU CHO CẢ 2 TRANG ============
    function handleResponsiveMenu() {
        const menuBar = document.querySelector('.menu-bar');
        let menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth <= 768) {
            if (!menuToggle && menuBar) {
                menuToggle = document.createElement('button');
                menuToggle.className = 'menu-toggle';
                menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
                menuToggle.style.cssText = `
                    display: block;
                    background: none;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                    padding: 10px;
                    color: #333;
                `;
                menuBar.appendChild(menuToggle);
                
                menuToggle.addEventListener('click', function() {
                    const menuContent = document.querySelector('.menu-bar-content ul');
                    if (menuContent) {
                        const isVisible = menuContent.style.display === 'block';
                        menuContent.style.display = isVisible ? 'none' : 'block';
                        menuContent.style.position = 'absolute';
                        menuContent.style.top = '100%';
                        menuContent.style.left = '0';
                        menuContent.style.backgroundColor = 'white';
                        menuContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        menuContent.style.zIndex = '1000';
                        menuContent.style.width = '100%';
                    }
                });
            }
        } else if (menuToggle) {
            menuToggle.style.display = 'none';
            const menuContent = document.querySelector('.menu-bar-content ul');
            if (menuContent) {
                menuContent.style.display = '';
                menuContent.style.position = '';
                menuContent.style.boxShadow = '';
            }
        }
    }
    
    // ============ KHỞI TẠO CHUNG ============
    
    // Xử lý responsive menu
    handleResponsiveMenu();
    window.addEventListener('resize', handleResponsiveMenu);
    
    // Thêm smooth scroll cho các liên kết neo
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
});