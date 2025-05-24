$(document).ready(function () {

    $.ajax({
        url: "/api/list_video_games",
        method: "GET",
        dataType: "json",
        success: function (data) {
            cargarTabla(data);
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar los datos:", error);
        }
    });
    cargarOpcionesFormulario();
});


function cargarTabla(data) {

    const cuerpo = data.map(d => [
        d.id,
        d.Name,
        d.Platform,
        d.Year,
        d.Genre,
        d.Publisher,
        parseFloat(d.NA_Sales).toFixed(2),
        parseFloat(d.EU_Sales).toFixed(2),
        parseFloat(d.JP_Sales).toFixed(2),
        parseFloat(d.Other_Sales).toFixed(2),
        parseFloat(d.Global_Sales).toFixed(2)
    ]);
    console.log(cuerpo);

    $('#tablaJuegos').DataTable({
        data: cuerpo,
        columns: [
            { title: "ID", visible: false },
            { title: "Título", },
            { title: "Plataforma" },
            { title: "Año" },
            { title: "Género" },
            { title: "Editor" },
            { title: "Ventas NA", className: "text-end" },
            { title: "Ventas EU", className: "text-end" },
            { title: "Ventas JP", className: "text-end" },
            { title: "Ventas Otros", className: "text-end" },
            { title: "Ventas Globales", className: "text-end" },
            {
                title: "Acciones",
                orderable: false,
                searchable: false,
                className: "text-center",
                render: function (data, type, row, meta) {
                    const id = row[0]; // si tienes ID, cámbialo por row[0] o como venga del backend
                    return `
                    <button class="btn btn-sm btn-warning btn-editar me-1">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>`;
                }
            }
        ],
        responsive: true
    });
}


/// cargar combos de filtros
function cargarOpcionesFormulario() {
    $.ajax({
        url: '/api/opciones',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            llenarCombo('#editarPlatform', data.plataformas);
            llenarCombo('#editarGenre', data.generos);
            llenarCombo('#editarPublisher', data.editores);
            llenarCombo('#editarYear', data.anios);

            llenarCombo('#addPlatform', data.plataformas);
            llenarCombo('#addGenre', data.generos);
            llenarCombo('#addPublisher', data.editores);
            llenarCombo('#addYear', data.anios);
        },
        error: function () {
            console.error("Error al cargar combos");
        }
    });
}

function llenarCombo(selector, valores) {
    const select = $(selector);
    select.empty();
    select.append('<option value="">-- Seleccione --</option>');
    valores.forEach(v => {
        select.append(`<option value="${v}">${v}</option>`);
    });
}

//Agregar Registro
$('#formAgregar').on('submit', function (e) {
    e.preventDefault();

    const datos = {
        rank: parseInt(this.rank.value),
        name: this.name.value,
        platform: this.platform.value,
        year: parseInt(this.year.value),
        genre: this.genre.value,
        publisher: this.publisher.value,
        na_sales: parseFloat(this.na_sales.value),
        eu_sales: parseFloat(this.eu_sales.value),
        jp_sales: parseFloat(this.jp_sales.value),
        other_sales: parseFloat(this.other_sales.value),
        global_sales: parseFloat(this.global_sales.value)
    };

    $.ajax({
        url: '/add/video_games',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        success: function (response) {
            $('#modalAgregar').modal('hide');
            $('#formAgregar')[0].reset();
            $('#tablaJuegos').DataTable().destroy(); // Recarga
            cargarDatos(); // Vuelve a cargar la tabla
           // alert(response.mensaje);  
            mostrarToast('🎮 Videojuego agregado con éxito', 'success');
        },
        error: function () {
            alert('Error al guardar el videojuego.');
        }
    });
});


function cargarDatos() {
    $('#loader').removeClass('d-none');
    $.ajax({
        url: "/api/list_video_games",
        method: "GET",
        dataType: "json",
        success: function (data) {
            $('#tablaJuegos').DataTable().clear().destroy();
            cargarTabla(data);
        },
        error: function () {
            alert("Error al cargar datos");
        },
        complete: function () {
            $('#loader').addClass('d-none');
        }
    });
}


// mostrar mensajes
function mostrarToast(mensaje, tipo = 'primary') {
    const toastEl = $('#toastNotificacion');
    const toastBody = $('#toastMensaje');

    toastEl.removeClass('bg-primary bg-success bg-danger bg-warning');
    toastEl.addClass(`bg-${tipo}`);
    toastBody.text(mensaje);

    const toast = new bootstrap.Toast(toastEl[0]);
    toast.show();
}
