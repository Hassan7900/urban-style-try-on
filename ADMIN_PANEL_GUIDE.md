# Admin Panel Setup Guide

## Overview
The admin panel provides full control over products and orders for Urban Wear.

## Features
✅ **Dashboard with Statistics**
- Total orders, revenue, products
- Pending orders count

✅ **Order Management**
- View all orders
- Update order status (processing → confirmed → shipped → delivered)
- Search and filter orders
- View customer details

✅ **Product Management**
- Create new products
- Edit existing products
- Delete products
- Manage stock, pricing, categories
- Set try-on compatibility

## Access the Admin Panel

### URL
Visit: `http://localhost:5173/admin`

### How to Create an Admin User

#### Option 1: Via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **profiles** table
3. Find your user row (by email)
4. Edit the `role` column and change it to `admin`
5. Save changes

#### Option 2: Via SQL Query
Run this in your Supabase SQL Editor:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

#### Option 3: During Signup (Development Only)
You can temporarily modify the signup form to allow selecting "admin" as a role.

## Database Tables

### Orders Table
- Stores all customer orders
- Fields: order_number, customer info, items (JSON), payment details, status
- RLS policies: Users see their orders, admins see all

### Products Table (seller_products)
- Stores all products
- Fields: name, description, price, image, category, sizes, colors, stock
- RLS policies: Sellers manage their products, admins manage all

## Usage

### Managing Orders
1. Go to Admin Panel → Orders tab
2. Search by order number, customer name, or email
3. Filter by status
4. Click Edit button to change order status
5. Select new status and save

### Managing Products
1. Go to Admin Panel → Products tab  
2. Click "Add Product" to create new
3. Fill in product details (name, price, image URL, category, etc.)
4. Select sizes and colors (comma-separated)
5. Toggle stock status and try-on compatibility
6. Save product
7. Edit or delete existing products as needed

## Security
- Only users with `role='admin'` in profiles table can access `/admin`
- Unauthorized access redirects to home page
- All database operations use Supabase RLS policies

## Troubleshooting

**"Access denied" error**
- Verify your user has `role='admin'` in profiles table
- Check that you're logged in

**Orders not showing**
- Run database migrations to create orders table
- Check Supabase logs for errors

**Can't create products**
- Ensure admin user has proper permissions
- Check browser console for errors

## Next Steps
- Set up email notifications for order status changes
- Add product image upload (currently uses URLs)
- Add analytics and reports
- Add bulk actions for products
- Add user management section
