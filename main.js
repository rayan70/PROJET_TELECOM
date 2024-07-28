document.addEventListener('DOMContentLoaded', () => {
    function startImageSlideshow() {
      var images = [
        'img/449953218_522458500120028_439892520485203522_n.jpg',
        'img/450362370_1148653053062207_8416118468500862398_n.jpg',
        'img/450491903_1035658001495760_3147968269164029727_n.jpg',
        'img/451117699_1034610278170923_3397613430553570505_n.jpg'
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
  