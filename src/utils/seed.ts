import User from '../models/User';
import Category from '../models/Category';
import config from '../config';
import logger from './logger';

export const seedDatabase = async () => {
  try {
    // Seed admin user if not exists
    const adminExists = await User.findOne({ email: config.admin.email });
    if (!adminExists) {
      await User.create({
        name: config.admin.name,
        email: config.admin.email,
        password: config.admin.password,
        role: 'admin',
        phone: '09123456787',
        department: 'IT',
      });
      logger.info('Admin user created');
    }

    // Seed sample users
    const sampleUsers = [
      {
        name: 'احمد محمدی',
        email: 'ahmad@company.com',
        password: '123456',
        role: 'client',
        phone: '09123456789',
        department: 'حسابداری',
      },
      {
        name: 'علی تکنسین',
        email: 'ali@company.com',
        password: '123456',
        role: 'engineer',
        phone: '09123456788',
        department: 'IT',
      },
    ];

    for (const userData of sampleUsers) {
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        await User.create(userData);
        logger.info(`Sample user created: ${userData.email}`);
      }
    }

    // Seed initial categories
    const initialCategories = {
      hardware: {
        categoryId: 'hardware',
        label: 'مشکلات سخت‌افزاری',
        description: 'مشکلات مربوط به تجهیزات فیزیکی',
        subIssues: {
          'computer-not-working': {
            id: 'computer-not-working',
            label: 'رایانه کار نمی‌کند',
            description: 'رایانه روشن نمی‌شود یا به درستی کار نمی‌کند',
          },
          'printer-issues': {
            id: 'printer-issues',
            label: 'مشکلات چاپگر',
            description: 'چاپگر کار نمی‌کند یا کیفیت چاپ مناسب نیست',
          },
          'monitor-problems': {
            id: 'monitor-problems',
            label: 'مشکلات مانیتور',
            description: 'مانیتور تصویر نمایش نمی‌دهد یا مشکل در نمایش دارد',
          },
        },
      },
      software: {
        categoryId: 'software',
        label: 'مشکلات نرم‌افزاری',
        description: 'مشکلات مربوط به نرم‌افزارها و سیستم عامل',
        subIssues: {
          'os-issues': {
            id: 'os-issues',
            label: 'مشکلات سیستم عامل',
            description: 'مشکلات ویندوز، مک یا لینوکس',
          },
          'application-problems': {
            id: 'application-problems',
            label: 'مشکلات نرم‌افزار',
            description: 'نرم‌افزار کار نمی‌کند یا خطا می‌دهد',
          },
          'software-installation': {
            id: 'software-installation',
            label: 'نصب نرم‌افزار',
            description: 'نیاز به نصب یا به‌روزرسانی نرم‌افزار',
          },
        },
      },
      network: {
        categoryId: 'network',
        label: 'مشکلات شبکه',
        description: 'مشکلات اتصال به اینترنت و شبکه',
        subIssues: {
          'internet-connection': {
            id: 'internet-connection',
            label: 'مشکل اتصال اینترنت',
            description: 'عدم دسترسی به اینترنت یا اتصال کند',
          },
          'wifi-problems': {
            id: 'wifi-problems',
            label: 'مشکلات وای‌فای',
            description: 'عدم اتصال به شبکه بی‌سیم',
          },
          'network-drive': {
            id: 'network-drive',
            label: 'دسترسی به درایو شبکه',
            description: 'عدم دسترسی به فولدرهای مشترک',
          },
        },
      },
      email: {
        categoryId: 'email',
        label: 'مشکلات ایمیل',
        description: 'مشکلات مربوط به ایمیل و پیام‌رسانی',
        subIssues: {
          'email-not-working': {
            id: 'email-not-working',
            label: 'ایمیل کار نمی‌کند',
            description: 'عدم دریافت یا ارسال ایمیل',
          },
          'email-setup': {
            id: 'email-setup',
            label: 'تنظیم ایمیل',
            description: 'نیاز به تنظیم حساب ایمیل جدید',
          },
          'email-sync': {
            id: 'email-sync',
            label: 'همگام‌سازی ایمیل',
            description: 'مشکل در همگام‌سازی ایمیل‌ها',
          },
        },
      },
      security: {
        categoryId: 'security',
        label: 'مسائل امنیتی',
        description: 'مشکلات امنیتی و حفاظت از اطلاعات',
        subIssues: {
          'virus-malware': {
            id: 'virus-malware',
            label: 'ویروس یا بدافزار',
            description: 'احتمال آلودگی سیستم به ویروس',
          },
          'password-reset': {
            id: 'password-reset',
            label: 'بازنشانی رمز عبور',
            description: 'فراموشی رمز عبور حساب کاربری',
          },
          'security-incident': {
            id: 'security-incident',
            label: 'حادثه امنیتی',
            description: 'مشکوک بودن فعالیت‌های غیرعادی',
          },
        },
      },
      access: {
        categoryId: 'access',
        label: 'درخواست دسترسی',
        description: 'درخواست دسترسی به سیستم‌ها و منابع',
        subIssues: {
          'system-access': {
            id: 'system-access',
            label: 'دسترسی به سیستم',
            description: 'نیاز به دسترسی به سیستم یا نرم‌افزار خاص',
          },
          'permission-change': {
            id: 'permission-change',
            label: 'تغییر سطح دسترسی',
            description: 'نیاز به تغییر مجوزهای کاربری',
          },
          'new-account': {
            id: 'new-account',
            label: 'حساب کاربری جدید',
            description: 'درخواست ایجاد حساب کاربری جدید',
          },
        },
      },
    };

    for (const [categoryId, categoryData] of Object.entries(initialCategories)) {
      const categoryExists = await Category.findOne({ categoryId });
      if (!categoryExists) {
        await Category.create({
          categoryId: categoryData.categoryId,
          label: categoryData.label,
          description: categoryData.description,
          subIssues: new Map(Object.entries(categoryData.subIssues)),
        });
        logger.info(`Category created: ${categoryId}`);
      }
    }

    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};
