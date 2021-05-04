<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" :closable="false" show-icon>
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <el-form
        :model="params"
        :rules="rules"
        ref="ruleForm"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          style="height: 100%"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name" style="width: 50%">
              <el-input v-model="params.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
              style="width: 50%"
            >
              <el-input v-model="params.goods_price"></el-input>
            </el-form-item>
            <el-form-item
              label="商品名称"
              prop="goods_number"
              style="width: 50%"
            >
              <el-input v-model="params.goods_number"></el-input>
            </el-form-item>
            <el-form-item
              label="商品名称"
              prop="goods_weight"
              style="width: 50%"
            >
              <el-input v-model="params.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品属性" style="width: 50%">
              <el-cascader
                v-model="selectKey"
                placeholder="只能选择三级分类列表"
                :options="fatherList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                clearable
                style="width: 300px"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in this.manyList"
              :key="item.attr_id"
              style="width: 50%"
            >
              <el-checkbox-group v-model="manyCheckList">
                <el-checkbox
                  :label="i"
                  v-for="(i, id) in item.attr_vals"
                  :key="id"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item
              :label="item.attr_name"
              v-for="item in this.onlyList"
              :key="item.attr_id"
              style="width: 50%"
            >
              <el-checkbox-group v-model="onlyCheckList">
                <el-checkbox
                  :label="i"
                  v-for="(i, id) in item.attr_vals"
                  :key="id"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <!-- 接着写上传 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onSuccess"
              :headers="header"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <el-form-item
              label="商品内容"
              prop="goods_introduce"
              style="width: 100%"
            >
              <el-input
                v-model="params.goods_introduce"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
              ></el-input>
            </el-form-item>
            <el-button type="primary" @click="confirmAdd"> 确认添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="预览" :visible.sync="dialogVisiable" width="500px">
      <el-image :src="fileUrl"> </el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      dialogVisiable: false,
      fileUrl: "",
      params: {
        goods_name: "",
        goods_cat: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      header: {
        Authorization: sessionStorage.getItem("token"),
      },
      selectKey: [],
      fatherList: [],
      manyList: [],
      onlyList: [],
      manyCheckList: [],
      onlyCheckList: [],
      uploadURL: this.axios.defaults.baseURL + "upload",
      rules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getPrams();
  },
  computed: {
    catId() {
      return this.selectKey.length === 3 ? this.selectKey[2] : null;
    },
  },
  methods: {
    beforeLeave(newIndex) {
      if (this.catId !== null) {
        if (newIndex === "2") {
          this.getList(this.catId, "many");
        }
        if (newIndex === "3") {
          this.getList(this.catId, "only");
        }
        return true;
      }
      this.$message.warning("请选择商品属性！");
      return false;
    },
    getPrams() {
      this.axios.get("categories").then(({ data: res }) => {
        this.fatherList = res.data;
      });
    },
    async getList(id, sel) {
      if (id === null) return;
      const { data: res } = await this.axios.get(
        `categories/${id}/attributes`,
        { params: { sel } }
      );
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return false;
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals
          ? Array.from(new Set(item.attr_vals.split(",")))
          : [];
      });
      if (sel === "many") {
        this.manyList = res.data;
      } else {
        this.onlyList = res.data;
      }
    },
    handlePreview(file) {
      this.dialogVisiable = true;
      this.fileUrl = file.url;
    },
    handleRemove(res) {
      const path = res.response.data.tmp_path;
      const index = this.params.pics.findIndex((item) => item.pic === path);
      this.params.pics.splice(index, 1);
    },
    onSuccess(res) {
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg);
        return false;
      }
      this.params.pics.push({ pic: res.data.tmp_path });
    },
    confirmAdd() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          this.$message.error("请填写完整内容！");
          return false;
        }
        const params = JSON.parse(JSON.stringify(this.params));
        // 处理商品属性
        params.goods_cat = this.selectKey.join();
        // 处理 选择的参数和属性
        this.manyList.forEach((i) => {
          // 通过求两个数组的交集来解决！！！！ nice
          const com = i.attr_vals.filter((item) =>
            new Set(this.manyCheckList).has(item)
          );
          if (com.length !== 0) {
            params.attrs.push({
              attr_id: i.attr_id,
              attr_value: com.join(),
            });
          }
        });
        this.onlyList.forEach((i) => {
          // 通过求两个数组的交集来解决！！！！ nice
          const com = i.attr_vals.filter((item) =>
            new Set(this.onlyCheckList).has(item)
          );
          if (com.length !== 0) {
            params.attrs.push({
              attr_id: i.attr_id,
              attr_value: com.join(),
            });
          }
        });
        this.axios.post("goods", params).then(({ data: res }) => {
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg);
            return false;
          }
          this.$message.success(res.meta.msg);
          this.$router.push("/goods");
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.el-steps {
  margin: 10px 0 !important;
}
</style>
