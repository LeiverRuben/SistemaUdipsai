const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cedula = document.getElementById("cedula").value.trim();
  const password = document.getElementById("password").value.trim();

  if (loginError) {
    loginError.textContent = "";
    loginError.style.display = 'none';
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cedula, password })
    });

    const data = await res.json();

    // CASO ERROR
    if (!res.ok) {
      if (loginError) {
        loginError.textContent = data.error || "Error al ingresar";
        loginError.style.display = 'block';
      }
      return;
    }

    // CASO 1: CAMBIO DE CONTRASEÑA OBLIGATORIO (SweetAlert)
    if (data.status === "CHANGE_PASSWORD") {
      Swal.fire({
        icon: 'info',
        title: 'Seguridad',
        text: data.mensaje, // "Por seguridad, debes cambiar tu contraseña..."
        confirmButtonText: 'Ir a cambiarla',
        confirmButtonColor: '#003c55',
        allowOutsideClick: false
      }).then(() => {
        localStorage.setItem("tempUserId", data.userId);
        window.location.href = "/views/cambiocontrasena.html";
      });
      return;
    }

    // CASO 2: LOGIN EXITOSO
    if (data.status === "OK") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("nombreUsuario", data.datosUsuario.nombre);
      localStorage.setItem("rolUsuario", data.datosUsuario.rol);

      // Pequeña animación de éxito antes de redirigir
      const btn = loginForm.querySelector('button');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Bienvenido';
        btn.style.background = '#00b894';
      }

      setTimeout(() => {
        window.location.href = "/views/dashboard.html";
      }, 500);
    }

  } catch (error) {
    console.error(error);
    if (loginError) {
      loginError.textContent = "Error de conexión";
      loginError.style.display = 'block';
    }
  }
});