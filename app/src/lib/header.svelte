<script lang="ts">
</script>

<header class="bg-white border-b border-gray-200">
  <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold tracking-tight text-gray-900">
      <slot name="title" />
    </h1>
  </div>
</header>
<main>
  <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
    <slot />
  </div>
</main>
