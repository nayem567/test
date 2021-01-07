(function(window, document, Math) {
    
    // --------------------
    // Variables
    // --------------------
    
    // elements
    var $gallery,
        $spin,
        $works,
        $scroll,
        $space,
        $drag,
        $canvas;
    
    // projects
    var distance = 0,
        offset = 0,
        current = 0,
        origin = 0,
        end = 0,
        start = {},
        scroll = 100,
        angle = 360 / 20,
            radius;
    
    // canvas
    var ctx,
        frame,
        dots = 20,
        data = [],
        center = {};
    
    
    
    // --------------------
    // Utils
    // --------------------
    
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    function convert(n, z) {
        return n / (z / 2000 + 1);
    }
    
    function opacity(i) {
        return 1 - Math.abs((origin - angle * i) / 30);
    }
    
    function Dot(x, r, a) {
        this.x = x;
        this.r = r;
        this.a = Math.PI * a + Math.PI / 2;
    }
    
    function pixels(value) {
        return value * scroll / end
    }
    
    function degrees(value) {
        return value * end / scroll
    }
    
    function change(value) {
        offset = value;
        distance = offset;
        current = origin;
    }
    
    
    
    // --------------------
    // Animation
    // --------------------
    
    function canvas() {
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        for (var j = 0; j < data.length; j++) {
            
            var P = data[j];
            var z = P.r * Math.cos(P.a);
            var s = convert(1, z);
            var x = center.x + convert(P.x, z);
            var y = center.y + convert(P.r * Math.sin(P.a), z);
            var o = -z / P.r * 0.4;
            
            ctx.fillStyle = 'rgba(255,255,255,' + o + ')';
            ctx.fillRect(x, y, s, s);
            
            P.a += offset / 2000 + 0.002 * (offset < 0 ? -1 : 1);
            if (P.a > Math.PI * 1.5) {P.a -= Math.PI;}
            if (P.a < Math.PI * 0.5) {P.a += Math.PI;}
        }
    }
    
    function projects() {
        $spin.style.transform = 'rotateX(' + origin + 'deg)';
        $drag.style.transform = 'translateY(' + origin * 100 / end + 'px)';
        for (var i = 0; i < $works.length; i++) {
            $works[i].style.opacity = opacity(i);
        }
    }
    
    function move() {
        offset *= 0.96;
        origin = current + distance - offset;
    }
    
    function animate() {
        move();
        projects();
        canvas();
        frame = requestAnimationFrame(animate);
    }
    
    
    
    // --------------------
    // Listeners
    // --------------------
    
    function wheel(event) {
        var i = event.deltaY > 0 ? 1 : -1;
        var s = angle / 2;
        if (origin > end - s && i > 0) distance = end - origin;
        else if (origin < s && i < 0) distance = origin * i;
        else distance = s * i;
        offset = distance;
        current = origin;
        event.preventDefault();
    }
    
    function resize() {
        update();
        create();
    }
    
    function click(event) {
        change(degrees(event.pageY - this.getBoundingClientRect().top - pixels(origin)));
    }
    
    function down(event) {
        event.stopPropagation();
        start.y = event.pageY;
        start.o =  origin;
        change(0);
    }
    
    function drag(event) {
        if (start.y) {
            var s = event.pageY - start.y;
            var p = pixels(start.o);
            if (p + s > scroll) s = scroll - p;
            if (p + s < 0) s = -p;
            change(degrees(s) + start.o - origin);
        }
    }
    
    function up() {
        start.y = false;
    }
    
    
    
    // --------------------
    // Creation
    // --------------------
    
    function create() {
        data.length = 0;
        var width = $canvas.width / 2 / 20;
        var circles = Math.ceil($canvas.width  / 2 / width);
        for (var i = 0; i < circles; i++) {
            var x = i * width;
            var r = random(100, 10);
            for (var j = 0; j < dots; j++) {
                data.push(new Dot(x, r, j / dots));
                i && data.push(new Dot(-x, r, j / dots));
            }
        }
    }
    
    function style() {
        $gallery.style.transform = 'translateZ(-' + radius + 'px)';
        for (var i = 0; i < $works.length; i++) {
            $works[i].style.transform = 'rotateX(-' +  angle * i + 'deg) translateZ(' + radius + 'px)';
        }
    }
    
    function update() {
        $canvas.width = document.body.offsetWidth;
        $canvas.height = document.body.offsetHeight;
        center.x = $canvas.width / 2;
        center.y = $canvas.height / 2;
    }
    
    
    
    // --------------------
    // Initialization
    // --------------------
    
    function values() {
        end = angle * ($works.length - 1);
        ctx = $canvas.getContext('2d');
        radius = $gallery.offsetHeight / 1.7 / Math.tan(Math.PI / 20);
    }
    
    function events() {
        document.addEventListener('wheel', wheel, false);
        window.addEventListener('resize', resize, false);
        $space.addEventListener('mousedown', click, false);
        $drag.addEventListener('mousedown', down, false);
        document.addEventListener('mousemove', drag, false);
        document.addEventListener('mouseup', up, false);
    }
    
    function elements() {
        $gallery = document.getElementById('gallery');
        $spin = $gallery.firstElementChild;
        $works = $spin.children;
        $scroll = document.getElementById('scroll');
        $space = $scroll.firstElementChild;
        $drag = $space.firstElementChild;
        $canvas = document.querySelector('canvas');
    }
    
    function init() {
        elements();
        events();
        values();
        resize();
        style();
        animate();
    }
    
    document.addEventListener('DOMContentLoaded', init, false);
    
})(window, document, Math);