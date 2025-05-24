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
    //cargarOpcionesFormulario();
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