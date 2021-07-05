<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片视图-->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
                <!--clearable 是否可清空-->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList" @blur="getGoodsList">
              <template #append>
                <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goAddpage">添加商品</el-button>
          </el-col>
        </el-row>

        <!-- table表格区域 -->
        <el-table :data="goodslist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
          <el-table-column label="添加时间" prop="add_time" width="140px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
            <!--@size-change= pageSize 改变时会触发-->
            <!--@current-change  currentPage页码改变时会触发-->
            <!--:current-page  当前页数-->
            <!--page-sizes 每页显示个数选择器的选项设置-->
            <!--page-size  每页显示条目个数-->
            <!--layout 组件布局，子组件名用逗号分隔-->
            <!--total 总条目数-->
            <!--background 是否为分页按钮添加背景色-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
        </el-pagination>

      </el-card>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        // 商品列表
        goodslist: [],
        // 总数据条数
        total: 0
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      // 根据分页获取对应的商品列表
      async getGoodsList() {
        const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
        // this.$message.success('获取商品列表成功！')
        // console.log(res.data)
        this.goodslist = res.data.goods
        this.total = res.data.total
      },
      // pageSize 改变时会触发
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      // 页码改变时会触发
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      // 根据id删除对应的参数或属性
      async removeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除！')
        }
        // `goods/${id}` 采用模板字符串的形式也可以
        const { data: res } = await this.$http.delete('goods/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getGoodsList()
      },
      goAddpage() {
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
