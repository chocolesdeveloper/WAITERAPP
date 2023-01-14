import { useEffect, useState } from "react"
import { api } from "../../services/api"

import sockletIo from "socket.io-client"

import { OrderProps } from "../../types/order"

import { OrdersBoard } from "../OrdersBoard"

import { Container } from "./styles"

export function Orders() {
  const [orders, setOrders] = useState<OrderProps[]>([])

  useEffect(() => {
    const io = sockletIo("http://localhost:3001", {
      transports: ["websocket"],
    })

    io.on("orders@new", (order) => {
      setOrders((prevState) => prevState.concat(order))
    })
  }, [])

  useEffect(() => {
    api.get("/orders").then(({ data }) => {
      setOrders(data)
    })
  }, [])

  const waiting = orders.filter((order) => order.status === "WAITING")
  const inProduction = orders.filter(
    (order) => order.status === "IN_PRODUCTION"
  )
  const done = orders.filter((order) => order.status === "DONE")

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) => prevState.filter((order) => order._id !== orderId))
  }

  function handleOrderStatusChange(
    orderId: string,
    status: OrderProps["status"]
  ) {
    setOrders((prevState) =>
      prevState.map((order) =>
        order._id === orderId ? { ...order, status } : order
      )
    )
  }

  return (
    <Container>
      <OrdersBoard
        title="Fila de espera"
        icon="🕔"
        orders={waiting}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoard
        title="Em preparação"
        icon="👨‍🍳"
        orders={inProduction}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoard
        title="Pronto"
        icon="✔"
        orders={done}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
    </Container>
  )
}
