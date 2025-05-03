$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
    
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        if (target) {
            $('html, body').animate({
                scrollTop: $(target).offset().top - 70
            }, 800);
        }
    });

    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#dailyFact').html('<p class="mb-2"><strong>"' + data.text + '"</strong></p><p class="small">Fun fact for day ' + data.number + ' of month ' + data.year + '</p>');
        },
        error: function() {
            $('#dailyFact').text('Unable to load the daily fact. Please try again later.');
        }
    });

    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileUpload');
    const imagePreview = document.getElementById('imagePreview');

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('border-primary');
        uploadArea.style.backgroundColor = 'rgba(255, 107, 107, 0.05)';
    }
    
    function unhighlight() {
        uploadArea.classList.remove('border-primary');
        uploadArea.style.backgroundColor = '';
    }
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length > 0) {
            Array.from(files).forEach(file => {
                if (!file.type.match('image.*')) {
                    alert('Only image files are allowed!');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
                    imagePreview.appendChild(previewItem);
                    $(previewItem).hide().fadeIn(500);
                }
                reader.readAsDataURL(file);
                uploadFile(file);
            });
        }
    }
    
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        $.ajax({
            url: '/upload', 
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Upload successful:', response);
            },
            error: function(error) {
                console.error('Upload error:', error);
            }
        });
    }
    $(window).scroll(function() {
        $('.service-box').each(function() {
            const position = $(this).offset().top;
            const scroll = $(window).scrollTop();
            const windowHeight = $(window).height();
            
            if (scroll + windowHeight > position + 100) {
                $(this).css('opacity', '1');
                $(this).css('transform', 'translateY(0)');
            }
        });
    });

    $('.service-box').css({
        'opacity': '0',
        'transform': 'translateY(30px)',
        'transition': 'all 0.6s ease'
    });
});