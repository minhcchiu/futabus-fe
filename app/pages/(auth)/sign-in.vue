<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { LoginSchema } from "~/validations/auth.validation";

definePageMeta({ layout: "auth", middleware: ["only-visitor"] });

const router = useRouter();
const query = useRoute().query;
const authStore = useAuthStore();
const { loading, tokens } = storeToRefs(authStore);

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: toTypedSchema(LoginSchema),
});

const onSubmit = handleSubmit(async (values) => {
  await authStore.login(values);
});

watch(tokens, () => {
  if (tokens.value) {
    // Redirect to the previous page
    if (tokens.value) {
      const from = query.from as string | undefined;
      if (!from) return router.push({ path: "/admin" });

      const [path = "", queryString = {}] = from.split("?");
      router.push({
        path,
        query: Object.fromEntries(new URLSearchParams(queryString)),
      });
    }
  }
});

const navigateToForgotPass = () =>
  router.push({ path: "/forgot-password", query });
const navigateToSignUp = () => router.push({ path: "/sign-up", query });
</script>

<template>
  <div
    class="border-border bg-background mx-auto w-full max-w-md rounded-2xl border p-6 shadow-sm md:p-8"
  >
    <!-- Header -->
    <div class="mb-6 space-y-2 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">Admin Sign In</h1>
      <p class="text-muted-foreground text-sm">
        Sign in to access the administration dashboard
      </p>
    </div>

    <!-- Social login -->
    <div class="space-y-4">
      <social-login :disabled="loading" />
      <Separator label="or continue with" />
    </div>

    <!-- Form -->
    <form class="mt-6 space-y-5" @submit="onSubmit">
      <!-- Email / Phone -->
      <FormField
        v-slot="{ componentField }"
        name="authKey"
        :validate-on-blur="!isFieldDirty"
      >
        <FormItem>
          <FormControl>
            <Input
              class="h-11"
              type="text"
              placeholder="Email or phone number"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Password -->
      <FormField
        v-slot="{ componentField }"
        name="password"
        :validate-on-blur="!isFieldDirty"
      >
        <FormItem>
          <FormControl>
            <Input
              class="h-11"
              type="password"
              placeholder="Password"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />

          <div class="text-right">
            <Button
              type="button"
              variant="link"
              class="text-muted-foreground px-0 text-xs hover:text-primary"
              @click="navigateToForgotPass"
            >
              Forgot password?
            </Button>
          </div>
        </FormItem>
      </FormField>

      <!-- Submit -->
      <Button type="submit" class="h-11 w-full" :disabled="loading">
        <Icon
          v-if="loading"
          name="lucide:loader"
          class="mr-2 h-4 w-4 animate-spin"
        />
        Sign In
      </Button>
    </form>

    <!-- Footer -->
    <div class="text-muted-foreground mt-6 text-center text-sm">
      Don’t have an account?
      <Button
        type="button"
        variant="link"
        class="px-1 text-primary"
        @click="navigateToSignUp"
      >
        Sign up
      </Button>
    </div>
  </div>
</template>
