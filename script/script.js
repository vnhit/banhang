// script.js - Enhanced with menu functionality and proper navigation

// ============ ĐỊA CHỈ FORM ============
const adressbtn = document.querySelector('#adress-form')
const adressclose = document.querySelector('#adress-close')

if (adressbtn) {
    adressbtn.addEventListener("click", function(e){
        e.preventDefault();
        document.querySelector('.adress-form').style.display = "flex"
    })
}

if (adressclose) {
    adressclose.addEventListener("click", function(){
        document.querySelector('.adress-form').style.display = "none"
    })
}

// Đóng form khi click background
const addressForm = document.querySelector('.adress-form');
if (addressForm) {
    addressForm.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

// ============ DROPDOWN MENU ============
document.addEventListener('DOMContentLoaded', function() {
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

    // ============ RESPONSIVE MENU ============
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

    // ============ NAVIGATION LINKS ============
    // Xử lý tất cả các liên kết navigation
    document.addEventListener('click', function(e) {
        const clickedElement = e.target.closest('a');
        if (!clickedElement) return;
        
        const href = clickedElement.getAttribute('href');
        if (!href) return;
        
        // Xử lý các liên kết laptop
        if (href.includes('laptop') || clickedElement.getAttribute('data-brand')) {
            const brand = clickedElement.getAttribute('data-brand');
            const textContent = clickedElement.textContent.trim().toLowerCase();
            
            // Kiểm tra nếu là liên kết laptop
            if (href.includes('laptop') || textContent.includes('laptop') || 
                textContent.includes('dell') || textContent.includes('hp') || 
                textContent.includes('lenovo') || textContent.includes('msi')) {
                
                e.preventDefault();
                
                let targetBrand = brand || 'all';
                
                // Xác định brand từ text content nếu không có data-brand
                if (!brand) {
                    if (textContent.includes('dell')) targetBrand = 'dell';
                    else if (textContent.includes('hp')) targetBrand = 'hp';
                    else if (textContent.includes('lenovo')) targetBrand = 'lenovo';
                    else if (textContent.includes('msi')) targetBrand = 'msi';
                }
                
                let url = '../left/laptops.html';
                if (targetBrand && targetBrand !== 'all') {
                    url += '?brand=' + targetBrand;
                }
                
                window.location.href = url;
                return;
            }
        }
        
        // Xử lý các liên kết camera
        if (href.includes('camera') || href.includes('cameras')) {
            const brand = clickedElement.getAttribute('data-brand');
            const textContent = clickedElement.textContent.trim().toLowerCase();
            
            // Kiểm tra nếu là liên kết camera
            if (href.includes('camera') || textContent.includes('camera') || 
                textContent.includes('canon') || textContent.includes('sony') || 
                textContent.includes('fujifilm')) {
                
                e.preventDefault();
                
                let targetBrand = brand || 'all';
                
                // Xác định brand từ text content nếu không có data-brand
                if (!brand) {
                    if (textContent.includes('canon')) targetBrand = 'canon';
                    else if (textContent.includes('sony')) targetBrand = 'sony';
                    else if (textContent.includes('fujifilm')) targetBrand = 'fujifilm';
                }
                
                let url = '../left/cameras.html';
                if (targetBrand && targetBrand !== 'all') {
                    url += '?brand=' + targetBrand;
                }
                
                window.location.href = url;
                return;
            }
        }
        
        // Xử lý các liên kết khác (phụ kiện, etc.)
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            // Kiểm tra xem có phải là liên kết nội bộ không
            if (href.startsWith('../') || href.includes('.html')) {
                // Chỉ xử lý nếu file tồn tại
                const validPages = [
                    'cameras.html', 'laptops.html', 'card-do-hoa.html', 
                    'cpu.html', 'the-nho.html', 'chan-may-anh.html', 
                    'den-flash.html', 'filter.html'
                ];
                
                const fileName = href.split('/').pop();
                if (validPages.includes(fileName)) {
                    // Cho phép navigation bình thường
                    return;
                } else {
                    // Ngăn chặn navigation đến các trang không tồn tại
                    e.preventDefault();
                    console.warn('Page not found:', href);
                }
            }
        }
    });

    // ============ ENHANCED SEARCH FUNCTIONALITY ============
    const searchInput = document.querySelector('input[placeholder="Bạn tìm gì?"]');
    const searchIcon = document.querySelector('.fa-magnifying-glass');

    // Hàm tìm kiếm thông minh
    function performSmartSearch(searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        
        // Danh sách từ khóa để phân loại sản phẩm (chính xác hơn)
        const laptopKeywords = ['laptop', 'dell', 'hp', 'lenovo', 'msi', 'thinkpad', 'inspiron', 'pavilion', 'ideapad', 'gaming laptop', 'ultrabook'];
        const cameraKeywords = ['camera', 'máy ảnh', 'canon', 'sony', 'fujifilm', 'eos', 'alpha', 'mirrorless', 'dslr', 'lens', 'ống kính'];
        const accessoryKeywords = ['phụ kiện', 'card đồ họa', 'cpu', 'thẻ nhớ', 'chân máy', 'đèn flash', 'filter'];
        
        // Xác định loại sản phẩm dựa trên từ khóa (ưu tiên từ khóa cụ thể nhất)
        let productType = null;
        let targetBrand = 'all';
        
        // Kiểm tra từ khóa phụ kiện trước (ưu tiên cao nhất)
        if (accessoryKeywords.some(keyword => lowerSearchTerm.includes(keyword))) {
            // Chuyển hướng đến trang phụ kiện tương ứng
            if (lowerSearchTerm.includes('card đồ họa') || lowerSearchTerm.includes('card do hoa')) {
                return '../left/card-do-hoa.html';
            } else if (lowerSearchTerm.includes('cpu')) {
                return '../left/cpu.html';
            } else if (lowerSearchTerm.includes('thẻ nhớ') || lowerSearchTerm.includes('the nho')) {
                return '../left/the-nho.html';
            } else if (lowerSearchTerm.includes('chân máy') || lowerSearchTerm.includes('chan may')) {
                return '../left/chan-may-anh.html';
            } else if (lowerSearchTerm.includes('đèn flash') || lowerSearchTerm.includes('den flash')) {
                return '../left/den-flash.html';
            } else if (lowerSearchTerm.includes('filter')) {
                return '../left/filter.html';
            }
        }
        
        // Kiểm tra từ khóa laptop cụ thể
        const isLaptopSearch = lowerSearchTerm.includes('laptop') || 
                              lowerSearchTerm.includes('dell') || 
                              lowerSearchTerm.includes('hp') || 
                              lowerSearchTerm.includes('lenovo') || 
                              lowerSearchTerm.includes('msi') ||
                              lowerSearchTerm.includes('thinkpad') ||
                              lowerSearchTerm.includes('inspiron') ||
                              lowerSearchTerm.includes('pavilion') ||
                              lowerSearchTerm.includes('ideapad');
        
        // Kiểm tra từ khóa camera cụ thể  
        const isCameraSearch = lowerSearchTerm.includes('camera') || 
                              lowerSearchTerm.includes('máy ảnh') ||
                              lowerSearchTerm.includes('canon') || 
                              lowerSearchTerm.includes('sony') || 
                              lowerSearchTerm.includes('fujifilm') ||
                              lowerSearchTerm.includes('eos') ||
                              lowerSearchTerm.includes('alpha') ||
                              lowerSearchTerm.includes('mirrorless') ||
                              lowerSearchTerm.includes('dslr') ||
                              lowerSearchTerm.includes('lens') ||
                              lowerSearchTerm.includes('ống kính');
        
        // Quyết định loại sản phẩm
        if (isLaptopSearch && !isCameraSearch) {
            productType = 'laptop';
            // Xác định thương hiệu laptop
            if (lowerSearchTerm.includes('dell')) targetBrand = 'dell';
            else if (lowerSearchTerm.includes('hp')) targetBrand = 'hp';
            else if (lowerSearchTerm.includes('lenovo')) targetBrand = 'lenovo';
            else if (lowerSearchTerm.includes('msi')) targetBrand = 'msi';
        } else if (isCameraSearch && !isLaptopSearch) {
            productType = 'camera';
            // Xác định thương hiệu camera
            if (lowerSearchTerm.includes('canon')) targetBrand = 'canon';
            else if (lowerSearchTerm.includes('sony')) targetBrand = 'sony';
            else if (lowerSearchTerm.includes('fujifilm')) targetBrand = 'fujifilm';
        } else {
            // Nếu không rõ ràng hoặc cả hai, tìm kiếm trong cả hai loại
            // Ưu tiên camera làm mặc định
            productType = 'camera';
        }
        
        // Tạo URL dựa trên loại sản phẩm
        let targetUrl;
        if (productType === 'laptop') {
            targetUrl = '../left/laptops.html';
        } else {
            targetUrl = '../left/cameras.html';
        }
        
        // Thêm tham số tìm kiếm
        const params = new URLSearchParams();
        if (targetBrand !== 'all') {
            params.append('brand', targetBrand);
        }
        params.append('search', searchTerm);
        
        if (params.toString()) {
            targetUrl += '?' + params.toString();
        }
        
        return targetUrl;
    }

    function handleSearch() {
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') {
            return;
        }
        
        if (searchTerm.length < 2) {
            return;
        }
        
        try {
            const targetUrl = performSmartSearch(searchTerm);
            window.location.href = targetUrl;
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    // Event listeners cho tìm kiếm
    if (searchInput) {
        // Tìm kiếm khi nhấn Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
        
        // Tìm kiếm khi nhấn Ctrl + Enter (tìm kiếm nâng cao)
        searchInput.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                // Tìm kiếm trong tất cả sản phẩm
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    const allProductsUrl = '../left/cameras.html?search=' + encodeURIComponent(searchTerm) + '&all=true';
                    window.location.href = allProductsUrl;
                }
            }
        });
        
        // Focus styling
        searchInput.addEventListener('focus', function() {
            this.style.outline = '2px solid #007bff';
            this.style.borderColor = '#007bff';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.borderColor = '';
        });
    }

    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            handleSearch();
        });
        
        // Hover effect cho search icon
        searchIcon.addEventListener('mouseenter', function() {
            this.style.color = '#007bff';
            this.style.cursor = 'pointer';
        });
        
        searchIcon.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    }

    // ============ KHỞI TẠO ============
    handleResponsiveMenu();
    window.addEventListener('resize', handleResponsiveMenu);

    // Smooth scroll cho các liên kết neo
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

    console.log('Enhanced script.js with improved search functionality loaded successfully!');
});