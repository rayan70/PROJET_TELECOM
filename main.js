document.addEventListener('DOMContentLoaded', () => {
    function startImageSlideshow() {
      var images = [
        "img/145812063633_content.jpg",
        "img/167905242399_content.jpg",
        'img/ceo-221021-00.jpg',
        'img/Netbox-TT-570x356-pxl.png',
        "img/tt-tunisie-telecome-challenges-tn.jpg",
        'img/Tunisie-Telecom-Horaires-double-séance.jpg',
        'img/Tunisie-Telecom.png'
        // Add more image paths as needed
      ];
      var slideshowContainer = document.querySelector('.slideshow');
      var imageIndex = 0;
  
      function changeImage() {
        var slides = slideshowContainer.getElementsByClassName('slide');
        slides[imageIndex].classList.remove('active');
        imageIndex = (imageIndex + 1) % images.length;
        slides[imageIndex].classList.add('active');
        slides[imageIndex].src = images[imageIndex];
      }
  
      // Change image every 3 seconds (adjust timing as needed)
      setInterval(changeImage, 3000);
    }
  
    // Start the slideshow
    startImageSlideshow();
  });
  