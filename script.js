
        // Look for .hamburger
        var hamburger = document.querySelector(".hamburger");
        var isOpen = false; // Track the state of the menu
      
        // On click
        hamburger.addEventListener("click", function() {
          // Toggle class "is-active"
          hamburger.classList.toggle("is-active");
          
          // Check if the menu is currently open or closed
          if (isOpen) {
            closeNav();
          } else {
            openNav();
          }
          
          // Toggle the state
          isOpen = !isOpen;
        });

         function fadeIn() {
          document.getElementById("main").style.opacity = "1";
          

        }
          
      
        function openNav() {
          document.getElementById("mySidenav").style.width = "250px";
          document.getElementById("main").style.marginLeft = "250px";
        }
        
        function closeNav() {
          document.getElementById("mySidenav").style.width = "0";
          document.getElementById("main").style.marginLeft= "0";
        }