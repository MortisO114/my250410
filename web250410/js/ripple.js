window.onload = () => {
    const button = document.getElementsByClassName(".btn")[0];
    button.addEventListener("click", (event) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = diameter + "px";
        circle.style.left = event.offsetX - (diameter / 2) + "px";
        circle.style.top = event.offsetY - (diameter / 2) + "px";
        circle.classList.add("ripple");
        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }
        button.appendChild(circle);
    });
};