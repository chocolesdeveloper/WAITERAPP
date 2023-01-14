import { ReactNode } from "react"

import { Container } from "./styles"

import { Text } from "../Text"
import { ActivityIndicator } from "react-native"

interface ButtonProps {
  children: ReactNode
  onPress: () => void
  disabled?: boolean
  isLoading?: boolean
}

export function Button({
  children,
  onPress,
  disabled,
  isLoading,
}: ButtonProps) {
  return (
    <Container onPress={onPress} disabled={disabled || isLoading}>
      {!isLoading ? (
        <Text weight="600" color="#fff">
          {children}
        </Text>
      ) : (
        <ActivityIndicator color="#fff" />
      )}
    </Container>
  )
}
