import { FlatList, StyleSheet, ViewStyle, View } from 'react-native'
import React from 'react'
import Loader from '../states/Loader'
import ProductCard from '../cards/ProductCard'
import { CONTAINER_SPACING } from '../../utils/constants'
import Empty from '../states/Empty'
import { useNavigation } from '@react-navigation/native'
import { Navigate_Product_Details } from '../../routes/path'

/**
 * 
 * @param {{
 * data:[],
 * isLoading:boolean,
 * error:any,
 * containerStyle: ViewStyle, 
 * contentContainerStyle:ViewStyle,
 * }} param0 
 * @returns 
 */


const SectionList = ({ data, isLoading, error, containerStyle, contentContainerStyle }) => {
  const navigation = useNavigation()
  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={{ margin: 15 }} />}
      numColumns={2}
      style={{ marginHorizontal: -CONTAINER_SPACING, ...containerStyle }}
      contentContainerStyle={{ flexGrow: 1, ...contentContainerStyle }}
      ListEmptyComponent={() => isLoading ? <Loader type={'simple'} /> : <Empty title='No product found!' />}
      data={data}
      renderItem={({ item, index }) => <ProductCard data={item} index={index} onPressItem={() => navigation.navigate(Navigate_Product_Details,{product:item})} />}
    />
  )
}

export default SectionList

const styles = StyleSheet.create({})