<template>
    <my-dialog v-model="props.isShow" title="Thêm mới di tích" width="1200" v-on:dismiss="emit('update:isShow', false)">
        <!-- child template -->
        <template #content>
            <v-form v-model="isValid" ref="form">
                <v-card>
                    <v-tabs v-model="tab" color="deep-purple-accent-4">
                        <v-tab value="tabInfo">Thông tin di tích lịch sử</v-tab>
                        <!-- <v-tab value="tabLink">Bài viết liên quan({{ links.length }})</v-tab> -->
                        <v-tab value="tabImage">Hình ảnh di tích({{ images.length }})</v-tab>
                    </v-tabs>
                    <v-window v-model="tab" class="pt-3 pl-3 pr-3">
                        <v-window-item value="tabInfo">
                            <v-row no-gutters>
                                <v-col cols="12" md="8">
                                    <v-text-field v-model="body.name" outlined label="Tên di tích"
                                        placeholder="Nhập tên di tích" variant="outlined" type="input"
                                        :rules="validator.name" hint="Nhập tên di tích">
                                    </v-text-field>
                                    <v-textarea label="Mô tả" v-model="body.introduce" placeholder="Nhập mô tả"
                                        variant="outlined" rows="1">
                                    </v-textarea>
                                    <v-textarea label="Bài viết liên quan" v-model="body.vrlink"
                                        placeholder="Nhập link bài viết" variant="outlined" rows="1">
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="body.areadetail" outlined label="Địa chỉ"
                                        placeholder="Nhập địa chỉ" variant="outlined" type="input"
                                        :rules="validator.areadetail" class="ml-3">
                                    </v-text-field>
                                    <v-text-field v-model="body.greatpeople" outlined label="Thông tin về doanh nhân"
                                        placeholder="Nhập thông tin về doanh nhân" variant="outlined" type="input"
                                        class="ml-3">
                                    </v-text-field>
                                    <v-text-field v-model="body.latlong" outlined label="Thông tin về địa chỉ tọa độ"
                                        placeholder="Nhập thông tin về địa chỉ tọa độ" variant="outlined" type="input"
                                        class="ml-3">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-window-item>
                        <!-- <v-window-item value="tabLink">
                            <v-row no-gutters>
                                <v-col cols="12" md="12">
                                    <v-btn class="mb-3" variant="outlined" color="warning" @click="addLink"><v-icon
                                            left>mdi-link</v-icon> Thêm đường dẫn </v-btn>
                                </v-col>
                            </v-row>
                            <Link v-model:links="links" :isRemove="true" v-on:removeLink="removeLink" />
                        </v-window-item> -->
                        <v-window-item value="tabImage">
                            <v-row no-gutters>
                                <v-btn class="mb-3" variant="outlined" color="warning"
                                    @click="() => { imageUploadDialogState = true }"><v-icon left>mdi-image</v-icon> Thêm
                                    hình
                                    ảnh</v-btn>
                                <ImagePicker v-model:isShow="imageUploadDialogState" :multiple="true"
                                    v-on:image-picker-upload-done="updateImageDone" />
                            </v-row>
                            <Gallery v-model:images="images" :isRemove="true" v-on:removeImage="removeImage" />
                        </v-window-item>
                    </v-window>
                </v-card>
            </v-form>
        </template>
        <template #action>
            <v-btn class="mt-3" variant="outlined" color="primary" @click="save"><v-icon left>mdi-content-save</v-icon> Lưu
                lại</v-btn>
        </template>
    </my-dialog>
</template>

<script setup>
import { reactive, ref, onUpdated } from 'vue'
import MyDialog from '@/components/Dialog.vue';
import ImagePicker from '@/components/ImagePicker.vue'
import Link from '@/components/LinkEditor.vue'
import Gallery from '@/components/ImageGallery.vue';
import { createSuggestedMenu } from '@/apis/modules/suggestedmenus.api';
import { deleteMultiFile } from '@/apis/modules/files.api';
import { useAppStore } from '@/store/app.store';
import { STATUS_ACTIVED } from '@/utils/constants'
import { createHistoricalSites } from '@/apis/modules/historicalsites.api';

const { showErrorAlert } = useAppStore();
const { showSuccessAlert } = useAppStore();

const props = defineProps({
    isShow: Boolean,
});
const emit = defineEmits(['update:isShow', 'done']);

const tab = ref(null);
const initialBody = {
    name: "",
    greatpeople: null,
    areadetail: "",
    // listlink: [],
    introduce: "",
    vrlink: "",
    latlong: "",
    images: [],
    status: STATUS_ACTIVED
}

const body = reactive({ ...initialBody });
const images = ref([]);
const imagesRemove = ref([]);
// const links = ref([]);
const imageUploadDialogState = ref(false);

const form = ref(null);
const loading = ref(false);
const isValid = ref(false);
const validator = ref({
    name: [value => !!value || 'Không được để trống tên di tích',],
    areadetail: [value => !!value || 'Không được để trống địa chỉ',],
})

function updateImageDone(data) {
    data.map(image => {
        images.value.push(image)
    })
}
function removeImage(image) {
    let index = images.value.findIndex(x => x._id == image._id)
    if (index >= 0) {
        //Thêm id file xóa vào mảng để khi lưu call api xóa file vật lý
        imagesRemove.value.push(images.value[index]._id)

        images.value.splice(index, 1)
    }
}

// function removeLink(index) {
//     links.value.splice(index, 1)
// }
// function addLink() {
//     links.value.push("");
// }

async function save() {
    await form.value.validate();

    if (isValid.value) {
        try {
            body.images = images.value.map(image => image._id)
            // body.listlink = links.value

            //Xóa ảnh đính kèm nếu có
            if (imagesRemove.value.length != 0) {
                deleteMultiFile(imagesRemove.value);
            }

            let res = await createHistoricalSites(body);
            if (res.error == "0") {
                showSuccessAlert(res.message)
                resetForm();
                //close dialog
                emit('update:isShow', false)
                emit('done');
            }
            else
                showErrorAlert(res.message)
        }
        catch (error) {
            const { message } = error;
            showErrorAlert(message)
        } finally {
        }
    } else {
        tab.value = "tabInfo"
    }
}

function resetForm() {
    Object.assign(body, initialBody);
    images.value = [];
    imagesRemove.value = [];
    // links.value = [];
}
</script>

