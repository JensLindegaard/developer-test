document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, JS is running.");

  const testimonialContainer = document.getElementById("testimonial-container");

  let isLoading = false; // Track if a fetch request is in progress
  let hasNext = true; // Track if more testimonials are available
  let lastTestimonialId = null; // ID of the last testimonial fetched

  // Fetch 5 testimonials
  function fetchTestimonials() {
    if (isLoading || !hasNext) {
      return; 
    }
    isLoading = true;

    let url =
      "https://corsproxy.io/?https://api.frontendexpert.io/api/fe/testimonials?limit=5";
    if (lastTestimonialId !== null) {
      url += `&after=${lastTestimonialId}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        hasNext = data.hasNext;

        data.testimonials.forEach((testimonial) => {
          // Create a new div for each testimonial
          const testimonialDiv = document.createElement("div");
          testimonialDiv.classList.add("testimonial");
          testimonialDiv.textContent = testimonial.message;

          // Append the testimonial to the container
          testimonialContainer.appendChild(testimonialDiv);
        });

        // Update cursor "after" to the last fetched testimonial's ID
        if (data.testimonials.length > 0) {
          lastTestimonialId = data.testimonials[data.testimonials.length - 1].id;
        }
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
      })
      .finally(() => {
        isLoading = false;
      });
  }

  // Check if scrolled to the bottom
  function onContainerScroll() {
    const container = testimonialContainer;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight - 100;

    if (scrollPosition >= scrollHeight) {
      fetchTestimonials();
    }
  }

  // Listen for scroll events on the container
  testimonialContainer.addEventListener("scroll", onContainerScroll);

  // Fetch initial 5 testimonials on page load
  fetchTestimonials();
});
