<template>
    <v-row>
        <v-col cols="12" md="12" class="link-editor" v-for="(link, index) in links" :key="index">
            <v-text-field v-model="links[index]" :append-icon="'mdi-delete'" variant="outlined"
                clear-icon="mdi-close-circle" label="Link bài viết" type="text"
                @click:append="$emit('removeLink', index)" />
        </v-col>
    </v-row>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    links: Object
})

</script>

<style scoped>
.link-editor {
    padding: 0px 12px 0px 12px;
}
</style>