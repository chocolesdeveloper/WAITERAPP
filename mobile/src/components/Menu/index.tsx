import { useState } from "react"
import { FlatList } from "react-native"

import {
  ProductImage,
  ProductContainer,
  ProductDetails,
  Separator,
  AddToCardButton,
} from "./styles"

import { Text } from "../Text"
import { ProductModal } from "../ProductModal"
import { PlusCircle } from "../Icons/PlusCircle"

import { formatCurrecy } from "../../utils/formatCurrency"

import { Product } from "../../types/Product"

interface MenuProps {
  onAddToCart: (product: Product) => void
  products: Product[]
}

export function Menu({ onAddToCart, products }: MenuProps) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null)

  function handleOpenModal(product: Product) {
    setIsModalVisible(true)
    setSelectedProduct(product)
  }

  return (
    <>
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />

      <FlatList
        data={products}
        style={{ marginTop: 32 }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        ItemSeparatorComponent={Separator}
        keyExtractor={(product) => product._id}
        renderItem={({ item: product }) => (
          <ProductContainer onPress={() => handleOpenModal(product)}>
            <ProductImage
              source={{
                uri: `http://192.168.18.190:3001/uploads/${product.imagePath}`,
              }}
            />
            <ProductDetails>
              <Text weight="600">{product.name}</Text>
              <Text size={14} color="#666" style={{ marginVertical: 8 }}>
                {product.description}
              </Text>
              <Text size={14} weight="600">
                {formatCurrecy(product.price)}
              </Text>
            </ProductDetails>

            <AddToCardButton onPress={() => onAddToCart(product)}>
              <PlusCircle />
            </AddToCardButton>
          </ProductContainer>
        )}
      />
    </>
  )
}
