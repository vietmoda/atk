<template>
  <my-dialog 
    v-model="props.isShow" title="Chỉnh sửa bài viết" width="90%" v-on:dismiss="emit('update:isShow', false)">
    <!-- child template -->
    <template #content >
      <v-form v-model="isValid" ref="form" lazy-validation class="card-news">
        <v-row no-gutters class="mb-4">
          <v-col cols="12" md="9">
            <v-text-field
              v-model="body.title"
              label="Tiêu đề"
              placeholder="Nhập tiêu đề"
              variant="outlined"
              type="input"
              clearable
              class="mr-lg-3"
              :rules="validator.title"
            />
            <v-textarea 
              label="Mô tả"
              v-model="body.description"
              placeholder="Nhập mô tả"
              variant="outlined"
              rows="2"
              class="mr-lg-3"
            >
            </v-textarea>
            <div class="mr-lg-3">
              <ContentEditor v-model:content="body.newsbody"/>
            </div>
          </v-col>
                      
          <v-col cols="12" md="3">
            <div class="thumbnail mb-5">
              <v-img title="Click để chọn ảnh thumbnail" height="135" :src="avatarSrc || '../src/assets/images/no-image.png'" @click="()=>{thumbnailDialogState=true}"></v-img>
              <ThumbnailPicker v-model:is-show="thumbnailDialogState" :avatarSrc="avatarSrc" v-on:thumbnail-picker-upload-done="updateThumbnailDone"/>
            </div>
            <v-select
              v-model="data.selectNewCategoryId"
              variant="outlined"
              label="Chuyên mục"
              :items="newCategories"
              item-title="label"
              item-value="value"
              multiple
              clearable
              persistent-hint
            />
            <v-text-field
              v-model="body.source"
              label="Nguồn tin"
              placeholder="Nhập nguồn tin"
              variant="outlined"
              type="input"
              clearable
            />
            <v-text-field
              v-model="body.author"
              label="Tác giả"
              placeholder="Nhập tác giả"
              variant="outlined"
              type="input"
              clearable
            />
            <v-textarea 
              label="Từ khóa"
              v-model="body.keywords"
              placeholder="Nhập từ khóa"
              variant="outlined"
              rows="2"
            />
            <!--Kiểm tra nếu bài viết đã xuất bản thì không cho sửa ngày xuất bản -->
            <div v-if="!data.isPublish">
              <v-checkbox
                v-model="data.checkPublish"
                label="Xuất bản ngay"
                color="primary"
                hide-details
                class="mb-2"
              ></v-checkbox>
              <v-text-field v-if="data.checkPublish"
                v-model="data.publishdate"
                label="Ngày xuất bản"
                placeholder="Nhập ngày xuất bản"
                variant="outlined"
                type="date"
                clearable
                :rules="validator.publishDate"
              />
            </div>
          </v-col>
        </v-row>
      </v-form>
   </template>
    <template #action>
      <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu lại</v-btn>
    </template>
  </my-dialog>
</template>

<script setup>
  import { MEDIA_SERVER } from '@/apis/httpClient'; 
  import { ref, reactive, onUpdated, watch } from 'vue';
  import MyDialog from '@/components/Dialog.vue';
  import moment from 'moment';
  import ThumbnailPicker from '@/components/ThumbnailPicker.vue'
  import ContentEditor from '@/components/ContentEditor.vue'
  import { getTreeNewsCategories } from '@/apis/modules/newscategories.api';
  import { updateNews } from '@/apis/modules/news.api';
  import { useAppStore } from '@/store/app.store';
  import { NEW_CATEGORY_TYPE, STATUS_ACTIVED, NEWS_STATUS } from '@/utils/constants'

  const { showErrorAlert } = useAppStore();
  const { showSuccessAlert } = useAppStore();

  const props = defineProps({
    isShow: Boolean,
    data:Object
  });
  const emit = defineEmits(['update:isShow', 'done']);

  const body = reactive({
    _id: "",
    title: "",
    description: "",
    newsbody: null,
    listcategoryid: "",
    newsstatus: NEWS_STATUS.CREATED,
    publishdate: "",
    author: "",
    source: "",
    image: "",
    status: STATUS_ACTIVED
  });


  const data = reactive({
      selectNewCategoryId: [],
      publishdate: null,
      checkPublish: false,
      isPublish: false
  })
  const thumbnailDialogState = ref(false);
  const avatarSrc = ref(undefined);
  const newCategories = ref([])

  const validator = reactive({
    title : [value => !!value || 'Không được để trống tiêu đề',],
    publishDate : [value => !!value || 'Không được để trống ngày phát hành',],
  });
  const form = ref(null);
  const isValid = ref(false);

  watch(()=>props.data,() =>{
    Object.assign(body,{...props.data})
  })

  onUpdated(async () => {
    let resCategories = await getTreeNewsCategories(STATUS_ACTIVED,NEW_CATEGORY_TYPE.NEWS,1);
    newCategories.value = resCategories.data.map(category=>{
      return{
        ...category,
        label: category.newscategoryname,
        value: category._id
      }
    });

    //kiểm tra nếu bài viết đã xuất bản => không cho sửa ngày xuất bản
    if (body.newsstatus == NEWS_STATUS.PUBLISHED){
      data.isPublish = true;
      data.checkPublish = true;
    }else{
      body.publishdate = body.publishdate || null;
      data.isPublish = false;
      data.checkPublish = false;
    }
      
    data.selectNewCategoryId = body?.listcategoryid || [];
    data.publishdate = body.publishdate ? moment(body.publishdate).format("YYYY-MM-DD") : null;

    const [image] = body.image || [];
    avatarSrc.value = image ? `${MEDIA_SERVER}/${image?.fileurl}` : undefined;
    body.image = image ? `${image?._id}` : "";
    body.imageolder = image ? `${image?._id}` : "";
    //console.log(body)
  })

  function updateThumbnailDone(data) {
    const [file] = data;
    avatarSrc.value = file?.fileurl || 'src/assets/images/no-avatar.png';
    body.image = file?._id;
  }

  async function save() {
    console.log("save")
    await form.value.validate();

    if(isValid.value) {
      try {
        body.listcategoryid = data.selectNewCategoryId
        body.newsstatus = data.checkPublish ? NEWS_STATUS.PUBLISHED : NEWS_STATUS.CREATED
        body.publishdate = data.checkPublish ? moment(data.publishdate, 'YYYY-MM-DD').format('DD/MM/YYYY') : null

        //save
        let res = await updateNews(body);
        if (res.error == "0"){
          showSuccessAlert(res.message)
          //close dialog
          emit('update:isShow', false)
          emit('done');
        }
        else
          showErrorAlert(res.message)
      }
      catch (error) {
        const {message} = error;
        showErrorAlert(message)
      } finally {
      }
    }
  }


</script>
