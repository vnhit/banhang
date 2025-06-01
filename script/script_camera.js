// script_camera.js - Script đồng bộ universal cho Index và Camera pages

// ============ HỆ THỐNG QUẢN LÝ CHUNG ============
window.ShopManager = window.ShopManager || {
    // Quản lý giỏ hàng chung (chỉ trong memory)
    cart: [],
    
    // Thêm sản phẩm vào giỏ hàng
    addToCart: function(product) {
        const existingProductIndex = this.cart.findIndex(item => 
            item.name === product.name && item.type === product.type
        );
        
        if (existingProductIndex > -1) {
            this.cart[existingProductIndex].quantity += 1;
        } else {
            this.cart.push({
                ...product,
                id: Date.now() + Math.random(),
                quantity: 1
            });
        }
        
        this.showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
    },
    
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

console.log('Universal Camera script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // ============ PHÁT HIỆN TRANG HIỆN TẠI ============
    const isCameraPage = document.querySelector('.brand-section') !== null;
    const isIndexPage = !isCameraPage;
    
    console.log('Page type:', isCameraPage ? 'Camera Page' : 'Index Page');
    
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
                const targetUrl = '../left/cameras.html?search=' + encodeURIComponent(searchTerm);
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
                let url = '../left/cameras.html';
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
    
    // ============ CHỨC NĂNG CHO TRANG CAMERA ============
    if (isCameraPage) {
        console.log('Initializing Camera page features');
        
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
            console.log('Showing brand section:', brandName);
            hideAllSections();
            const targetSection = document.getElementById(brandName);
            if (targetSection) {
                targetSection.style.display = 'block';
                console.log('Successfully showed section:', brandName);
                // Scroll to the brand section smoothly
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.log('Section not found:', brandName);
            }
        }
        
        // ============ XỬ LÝ THƯƠNG HIỆU ============
        brandLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const brand = this.getAttribute('data-brand');
                
                console.log('Brand clicked:', brand);
                
                // Xóa active class từ tất cả các link
                brandLinks.forEach(function(l) {
                    l.classList.remove('active');
                });
                // Thêm active class cho link được click
                this.classList.add('active');
                
                // Hiển thị section tương ứng
                if (brand === 'all') {
                    showAllSections();
                } else {
                    showBrandSection(brand);
                }
            });
        });
        
        // ============ XỬ LÝ THÊM VÀO GIỎ HÀNG ============
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.product-name').textContent.trim();
                const productPrice = productCard.querySelector('.product-price').textContent.trim();
                const productImage = productCard.querySelector('.product-image')?.src || '';
                const productDescription = productCard.querySelector('.product-description')?.textContent.trim() || '';
                
                const product = {
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    description: productDescription,
                    type: 'camera'
                };
                
                // Thêm loading state
                const originalText = this.textContent;
                this.textContent = 'Đang thêm...';
                this.disabled = true;
                this.style.backgroundColor = '#ff9800';
                
                // Sử dụng hệ thống quản lý chung
                window.ShopManager.addToCart(product);
                
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
            console.log('Loading with brand parameter:', brandParam);
            // Reset tất cả active states trước
            brandLinks.forEach(l => l.classList.remove('active'));
            
            // Tìm và active link tương ứng
            const targetLink = document.querySelector('[data-brand="' + brandParam + '"]');
            if (targetLink) {
                targetLink.classList.add('active');
                console.log('Found and activated brand link:', brandParam);
            }
            
            // Hiển thị section tương ứng
            showBrandSection(brandParam);
        } else if (searchParam) {
            if (searchInput) {
                searchInput.value = searchParam;
                performSearch(searchParam);
            }
        } else {
            // Mặc định hiển thị tất cả và active "Tất cả" link
            showAllSections();
            const allLink = document.querySelector('[data-brand="all"]');
            if (allLink) {
                brandLinks.forEach(l => l.classList.remove('active'));
                allLink.classList.add('active');
            }
        }
    }
});
