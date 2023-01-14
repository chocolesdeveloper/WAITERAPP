import { useState } from "react"
import { toast } from "react-toastify"

import { Board, OrdersContainer } from "./styles"

import { OrderProps } from "../../types/order"

import { OrderModal } from "../OrdersModal"

import { api } from "../../services/api"

interface OrdersBoardProps {
  title: string
  icon: string
  orders: OrderProps[]
  onCancelOrder: (orderId: string) => void
  onChangeOrderStatus: (orderId: string, status: OrderProps["status"]) => void
}

export function OrdersBoard({
  title,
  icon,
  orders,
  onCancelOrder,
  onChangeOrderStatus,
}: OrdersBoardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<null | OrderProps>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleOpenModal(order: OrderProps) {
    setIsModalVisible(true)
    setSelectedOrder(order)
  }

  function handleCloseModal() {
    setIsModalVisible(false)
    setSelectedOrder(null)
  }

  async function handleChangeOrderStatus() {
    setIsLoading(true)

    const newStatus =
      selectedOrder?.status === "WAITING" ? "IN_PRODUCTION" : "DONE"

    api.patch(`/orders/${selectedOrder?._id}`, {
      status: newStatus,
    })

    toast.success(
      `O pedido da mesa ${selectedOrder?.table} foi teve o status alterado com sucesso!`
    )
    onChangeOrderStatus(selectedOrder!._id, newStatus)
    setIsLoading(false)
    setIsModalVisible(false)
  }

  async function handleCancelOrder() {
    setIsLoading(true)

    await api.delete(`/orders/${selectedOrder?._id}`)

    if (selectedOrder?.status === "DONE") {
      toast.success(
        `O pedido da mesa ${selectedOrder?.table} foi apagado com sucesso!`
      )
    } else {
      toast.success(
        `O pedido da mesa ${selectedOrder?.table} foi cancelado com sucesso!`
      )
    }
    onCancelOrder(selectedOrder!._id)
    setIsLoading(false)
    setIsModalVisible(false)
  }

  return (
    <Board>
      <OrderModal
        visible={isModalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleChangeOrderStatus}
        isLoading={isLoading}
      />

      <header>
        <span>{icon}</span>
        <strong>{title}</strong>
        <span>({orders.length})</span>
      </header>

      {orders.length > 0 && (
        <OrdersContainer>
          {orders.map((order) => (
            <button
              type="button"
              key={order._id}
              onClick={() => handleOpenModal(order)}
            >
              <strong>Mesa {order.table}</strong>
              <span>{order.products.length} itens</span>
            </button>
          ))}
        </OrdersContainer>
      )}
    </Board>
  )
}
