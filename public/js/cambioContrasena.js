const form = document.getElementById("cambioForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nueva1 = document.getElementById("nueva1").value.trim();
    const nueva2 = document.getElementById("nueva2").value.trim();

    // Recuperamos el ID que guardamos en el login
    const usuarioId = localStorage.getItem("tempUserId");

    // 1. Validaciones con SweetAlert
    if (!usuarioId) {
        Swal.fire({
            icon: 'error',
            title: 'Error de sesión',
            text: 'No se identificó al usuario. Vuelve al Login.',
            confirmButtonColor: '#d33'
        }).then(() => {
            window.location.href = "/views/login.html";
        });
        return;
    }

    if (nueva1.length < 4) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña débil',
            text: 'La contraseña debe tener al menos 4 caracteres.',
            confirmButtonColor: '#003c55'
        });
        return;
    }

    if (nueva1 !== nueva2) {
        Swal.fire({
            icon: 'error',
            title: 'No coinciden',
            text: 'Las contraseñas escritas no son iguales.',
            confirmButtonColor: '#003c55'
        });
        return;
    }

    try {
        // Mostrar cargando...
        Swal.fire({
            title: 'Actualizando...',
            didOpen: () => { Swal.showLoading() }
        });

        const res = await fetch("/api/auth/cambiar-contrasena", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: usuarioId,
                nuevaPassword: nueva1
            })
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.error || "No se pudo actualizar.",
                confirmButtonColor: '#d33'
            });
            return;
        }

        // --- ÉXITO: ALERTA BONITA ---
        Swal.fire({
            icon: 'success',
            title: '¡Todo listo!',
            text: 'Contraseña actualizada. Inicia sesión con tu nueva clave.',
            confirmButtonText: 'Ir al Login',
            confirmButtonColor: '#00b894',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("tempUserId"); // Limpiar basura
                window.location.href = "/views/login.html";
            }
        });

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#d33'
        });
    }
});