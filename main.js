const cards = document.getElementById('cards');
const templateCard = document.getElementById ('template-card').content;
const fragment = document.createDocumentFragment();
const templateFooter = document.getElementById ('template-footer').content;
const templateCarrito = document.getElementById ('template-carrito').content;
const items = document.getElementById ('items');
const footer = document.getElementById ('footer');
let carrito = {};

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e => {
    agregarCarrito(e)
})

items.addEventListener('click', e => {
    btnAumentar(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        pintarCards(data)       
    } catch (error) {
        console.log(error)        
    }
}

const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute ("src", producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}


const agregarCarrito = e => {
    if (e.target.classList.contains('btn-dark')){
       setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito ()

}

const pintarCarrito = () => {
    items.innerHTML= ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode (true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter ()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML= ''
    if (Object.keys(carrito).lenght === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone=templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
    const btnComprar = document.getElementById('comprar')
    btnComprar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
        Swal.fire({
            title: 'Completar tus datos',
            html:'<div class="row">'+
            '<label class="col-sm-3 col-form-label">Nombre</label>'+
            '<div class="col-sm-7"><input type="text" class="form-control"></input></div></div>'+

            '<div class="row">'+
            '<label class="col-sm-3 col-form-label">Apellido</label>'+
            '<div class="col-sm-7"><input type="text" class="form-control"></input></div></div>'+

            '<div class="row">'+
            '<label class="col-sm-3 col-form-label">Telefono</label>'+
            '<div class="col-sm-7"><input type="text" class="form-control"></input></div></div>'+

            '<div class="row">'+
            '<label class="col-sm-3 col-form-label">Correo electronico</label>'+
            '<div class="col-sm-7"><input type="text" class="form-control"></input></div></div>',

            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Acepto',
            cancelButtonText: 'Cancelar',
            icon:'success',
        })
    })
}

const btnAumentar = e => {
    if(e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}

Swal.fire({
    html: 'Por favor acepte nuestros terminos y condiciones',
    confirmButtonText: 'Acepto',
    icon: 'info',
    padding: '1rem',
    grow: 'row',
    backdrop: true,
    toast: true,
    position: 'bottom',
    allowOutsideClick: false,
    allowEscapeKey: false,
    stopKeydownPropagation: false,

    showConfirmButton: true,
    showCancelButton: false,
    showCloseButton: false,
    closeButtonAriaLabel: 'Cerrar este alerta',
})