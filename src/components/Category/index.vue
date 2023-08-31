<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c1Id" @change="handler">
          <!-- option:label即为显示文字，value属性即为select下拉菜单收集的数据 -->
          <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c2Id" @change="handler1">
          <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene == 0 ? false : true" v-model="categoryStore.c3Id">
          <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>
// 引入生命周期的函数钩子
import { onMounted, ref } from 'vue';

import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()



onMounted(() => {
  getC1()
})
//  通知仓库获取一级分类方法
const getC1 = () => {
  categoryStore.getC1()
}

// 此方法为以及分类下拉菜单的change事件
const handler = () => {
  // 将二级三级分类数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  // 通知仓库获取二级分类方法
  categoryStore.getC2()

}

// 此方法为以及分类下拉菜单的changge事件
const handler1 = () => {
  // 将三级分类数据清空
  categoryStore.c3Id = ''
  // 通知仓库获取三级分类方法
  categoryStore.getC3()
}

// 接受父组件传递的scene
defineProps(['scene'])
</script>

<style scoped></style>