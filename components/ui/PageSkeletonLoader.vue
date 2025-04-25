<template>
    <div class="space-y-5">
        <!-- Breadcrumb Skeleton -->
        <div class="mb-3 mt-6">
            <Skeleton width="12rem" height="1.5rem" class="rounded"></Skeleton>
        </div>
    
        <!-- Card Container -->
        <div class="rounded-2xl border border-gray-200 dark:border-gray-200 p-6 bg-surface-0 dark:bg-surface-900 space-y-6">
    
            <!-- Action Buttons -->
            <div class="flex justify-between items-center flex-wrap gap-4">
                <!-- Left Button -->
                <Skeleton width="8rem" height="2.5rem" class="rounded"></Skeleton>
    
                <!-- Filter Pills -->
                <div class="flex gap-2">
                    <Skeleton v-for="n in 3" :key="'pill-'+n" width="5rem" height="2rem" class="rounded-full"></Skeleton>
                </div>
    
                <!-- Search Input -->
                <Skeleton width="14rem" height="2.5rem" class="rounded-md"></Skeleton>
            </div>
    
            <!-- Table Skeleton -->
            <div class="w-full space-y-4">
                <!-- Header Row -->
                <div class="grid grid-cols-4 gap-4">
                    <Skeleton v-for="n in 4" :key="'thead-'+n" height="2.5rem" width="100%" class="rounded"></Skeleton>
                </div>
    
                <!-- Rows -->
                <div v-for="r in 6" :key="'trow-'+r" class="grid grid-cols-4 gap-4">
                    <Skeleton v-for="c in 4" :key="'tcell-'+r+'-'+c" height="2.5rem" width="100%" class="rounded">
                    </Skeleton>
                </div>
            </div>
    
        </div>
    </div>
</template>
<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

//item count prop

</script>