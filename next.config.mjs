/* eslint-disable import/no-extraneous-dependencies, import/extensions */
import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntlConfig = withNextIntl('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default withSentryConfig(
  bundleAnalyzer(
    withNextIntlConfig({
      eslint: {
        dirs: ['.'],
      },
      poweredByHeader: false,
      reactStrictMode: true,
    }),
  ),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    // FIXME: Add your Sentry organization and project names
    org: '673972d1c6a2',
    project: 'next-app-demo',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // 要上传所有文件和源映射（包括来自第三方包的文件和源映射），请将选项设置 true
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // 配置隧道以避免广告拦截器
    // tunnelRoute: '/monitoring',

    // 阻止您构建的文件包含sourceMappingURL注释，从而使源映射对浏览器不可见
    hideSourceMaps: true,

    // 禁用 Sentry SDK 调试记录器以节省包大小
    disableLogger: true,

    // Vercel Cron 作业的检测
    // Vercel cron 作业的自动检测目前仅适用于 Pages Router。App Router 路由处理程序尚不受支持。
    automaticVercelMonitors: true,
  },
);
