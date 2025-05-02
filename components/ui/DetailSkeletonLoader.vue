<template>
    <div>
      <!-- PageBreadcrumb -->
      <div class="mb-4">
        <Skeleton width="15rem" height="2rem" borderRadius="12px" />
      </div>
  
      <!-- Card Wrapper -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <!-- Header with buttons -->
        <div class="flex items-center justify-between mb-4">
          <Skeleton width="8rem" height="2rem" borderRadius="10px" />
          <div class="flex gap-2">
            <Skeleton shape="circle" size="2.5rem" />
            <Skeleton shape="circle" size="2.5rem" />
            <Skeleton shape="circle" size="2.5rem" />
          </div>
        </div>
  
        <!-- Tabs -->
        <div class="mb-4 flex gap-3 border-b border-gray-200 pb-2">
          <Skeleton width="6rem" height="1.5rem" />
          <Skeleton width="6rem" height="1.5rem" />
          <Skeleton width="6rem" height="1.5rem" />
          <Skeleton width="6rem" height="1.5rem" />
        </div>
  
        <!-- Tab Panel Skeleton -->
        <div class="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-12">
            <Skeleton height="1.5rem" />
            <Skeleton height="1.5rem" />
            <Skeleton height="1.5rem" />
            <Skeleton height="1.5rem" />
            <Skeleton height="1.5rem" />
          </div>
  
          <!-- Image Placeholder -->
          <div class="mt-6 flex gap-4">
            <Skeleton width="200px" height="200px" borderRadius="12px" />
            <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Skeleton height="1.5rem" />
              <Skeleton height="1.5rem" />
              <Skeleton height="1.5rem" />
              <Skeleton height="1.5rem" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
//   import Skeleton from 'primevue/skeleton'
  </script>
  