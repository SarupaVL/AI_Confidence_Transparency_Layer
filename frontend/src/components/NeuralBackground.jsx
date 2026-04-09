import React, { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 120; // High count for immersive full-screen

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseOut = () => {
       mouse.x = -1000;
       mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        
        // Connect to mouse pointer
        const dxMouse = p1.x - mouse.x;
        const dyMouse = p1.y - mouse.y;
        const distMouse = dxMouse * dxMouse + dyMouse * dyMouse;
        
        if (distMouse < 28000) {
           ctx.beginPath();
           // Soft purplish glow for mouse connections (slightly toned down)
           ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - distMouse / 28000) * 0.65})`;
           ctx.moveTo(p1.x, p1.y);
           ctx.lineTo(mouse.x, mouse.y);
           ctx.stroke();
           
           // Slight gravitational pull towards mouse
           p1.vx -= dxMouse * 0.00003;
           p1.vy -= dyMouse * 0.00003;
        }

        // Connect particles to each other
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = dx * dx + dy * dy;

          if (dist < 15000) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - (dist / 15000)) * 0.10})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw actual particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (const p of particles) {
        // Friction to prevent infinite acceleration from mouse gravity
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        // Minimum drift speed so they never completely stop
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.08;
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.08;

        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw glowing focal point at mouse location
      if (mouse.x > 0 && mouse.y > 0) {
         // Dim the glow dynamically when near the centered text
         const centerX = width / 2;
         const distFromCenter = Math.abs(mouse.x - centerX);
         const textZoneHalfWidth = 400; // approximate half-width of the main content column
         
         let alphaMult = 1.0;
         if (distFromCenter < textZoneHalfWidth) {
            // Drop brightness down to 10% when perfectly centered, scaling up as it moves out
            alphaMult = 0.1 + 0.9 * (distFromCenter / textZoneHalfWidth);
         }

         ctx.beginPath();
         ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(167, 139, 250, ${0.9 * alphaMult})`;
         ctx.fill();
         
         ctx.beginPath();
         const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
         grad.addColorStop(0, `rgba(167, 139, 250, ${0.15 * alphaMult})`);
         grad.addColorStop(1, 'rgba(167, 139, 250, 0)');
         ctx.fillStyle = grad;
         ctx.arc(mouse.x, mouse.y, 200, 0, Math.PI * 2);
         ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{
       position: 'fixed',
       top: 0, left: 0, width: '100vw', height: '100vh',
       zIndex: -1, pointerEvents: 'none'
    }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
