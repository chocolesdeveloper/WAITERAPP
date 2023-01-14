import { Overlay, ModalBody, OrderDetails, Actions } from "./styles"

import { X } from "phosphor-react"

import { OrderProps } from "../../types/order"

import { formatCurrecy } from "../../utils/formatCurrency"
import { useEffect } from "react"

interface OrderModalProps {
  visible: boolean
  order: OrderProps | null
  isLoading: boolean
  onClose: () => void
  onCancelOrder: () => Promise<void>
  onChangeOrderStatus: () => void
}

export function OrderModal({
  visible,
  order,
  onClose,
  isLoading,
  onCancelOrder,
  onChangeOrderStatus,
}: OrderModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  if (!visible || !order) {
    return null
  }

  // let total = 0
  // order.products.forEach(({ product, quantity }) => {
  //   total += product.price * quantity
  // })

  const total = order.products.reduce((acc, { product, quantity }) => {
    return acc + product.price * quantity
  }, 0)

  return (
    <Overlay>
      <ModalBody>
        <header>
          <strong>Mesa {order.table}</strong>

          <button type="button" onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </header>

        <div className="status-container">
          <small>Status do pedido</small>
          <div>
            <span>
              {order.status === "WAITING" && "🕓"}
              {order.status === "IN_PRODUCTION" && "👨‍🍳"}
              {order.status === "DONE" && "✔"}
            </span>
            <strong>
              {order.status === "WAITING" && "Fila de espera"}
              {order.status === "IN_PRODUCTION" && "Em preparação"}
              {order.status === "DONE" && "Pronto"}
            </strong>
          </div>
        </div>

        <OrderDetails>
          <strong>Itens</strong>

          <div className="order-items">
            {order.products.map(({ _id, product, quantity }) => (
              <div className="item" key={_id}>
                <img
                  src={`http://localhost:3001/uploads/${product.imagePath}`}
                  alt={product.name}
                  width="56"
                  height="28.51"
                />

                <span className="quantity">{quantity}x</span>

                <div className="product-details">
                  <strong>{product.name}</strong>
                  <span>{formatCurrecy(product.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="total">
            <span>Total</span>
            <strong>{formatCurrecy(total)}</strong>
          </div>
        </OrderDetails>

        <Actions>
          {order.status !== "DONE" && (
            <button
              type="button"
              className="primary"
              disabled={isLoading}
              onClick={onChangeOrderStatus}
            >
              <span>{order.status === "WAITING" && "👨‍🍳"}</span>
              <span>{order.status === "IN_PRODUCTION" && "✔"}</span>
              <strong>
                {order.status === "WAITING" && "Iniciar produção"}
                {order.status === "IN_PRODUCTION" && "Concluir Pedido"}
              </strong>
            </button>
          )}
          <button
            type="button"
            className="secondary"
            onClick={onCancelOrder}
            disabled={isLoading}
          >
            {order.status === "DONE" ? "Apagar" : "Cancelar Pedido"}
          </button>
        </Actions>
      </ModalBody>
    </Overlay>
  )
}
