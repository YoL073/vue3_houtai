<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
      <el-table style="margin: 10px 0px;" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{ row, $index }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" style="width:100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
            <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="250px" icon="Delete" @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
        layout="prev, pager, next, jumper, ->,sizes, total" :total="total" @current-change="getHasTrademark"
        @size-change="sizeChange" />
    </el-card>

    <!-- 对话框组件：在添加品牌与已有品牌的业务时候使用结构 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width:80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <!-- 具名插槽 -->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { ElMessage, UploadProps } from 'element-plus'
import { ref, onMounted, reactive } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type'

// import { ElMessage } from 'element-plus/es/components/index.js';
//当前页码
let pageNo = ref<number>(1)
//每页展示多少条数据
let limit = ref<number>(3)
// 存储已有品牌的数据总数
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
// 定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
// 获取el-form组件实例
let formRef = ref()
// 获取已有品牌的接口封装为一个函数，在任何情况下获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

onMounted(() => {
  getHasTrademark()
})

// // 分页器当前页码发生变化时触发
// const changePageNo = () => {
//   // 当前页码发生变化时再次发请求，获取相应数据
//   getHasTrademark()
// }

const sizeChange = () => {

  getHasTrademark()
}

// 添加品牌按钮的回调
const addTrademark = () => {
  dialogFormVisible.value = true
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}

// 修改品牌按钮的回调
// row即为当前已有的品牌
const updateTrademark = (row: TradeMark) => {

  dialogFormVisible.value = true
  // console.log(row);
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // ES6写法
  Object.assign(trademarkParams, row)
}

const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false

}

const confirm = async () => {
  // 发请求之前，对整个表单进行校验
  // 调用这个方法进行全部表单相校验，如果校验全部通过，再执行后面的语句
  await formRef.value.validate()
  // 对话框隐藏
  let result = await reqAddOrUpdateTrademark(trademarkParams)
  // console.log(result);
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    // 再次发请求获取已有的全部数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    // 收集数据情况

  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '添加品牌失败' : '添加品牌失败'
    })
  }

}

// 上传图品组件，上传图片之前触发的狗子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  // 钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
  // 要求：上传文件格式png|jpg|gif
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M'
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必png|jpg|gif'
    })
    return false
  }
}

// 图片上传成功的狗子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // response：即为当前这次上传图片post请求服务器返回的数据
  // 收集上传的图片的地址，添加一个新的品牌的时候带给服务器
  // console.log(response);
  trademarkParams.logoUrl = response.data;
  // 图片上传成功，清除掉对应图片校验结果
  // console.log(formRef.value);
  formRef.value.clearValidate('logoUrl')
}

//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
//品牌LOGO自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}

// 表单校验规则对象
const rules = {
  tmName: [
    // trigger:代表触发校验规则时机[blur,change]
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}

// 气泡确认框确认按钮回调
const removeTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    // 删除品牌成功
    ElMessage({
      type: 'success',
      message: '删除品牌成功'
    })
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败'
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>