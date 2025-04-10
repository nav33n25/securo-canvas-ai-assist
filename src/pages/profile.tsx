
import React from 'react';
import * as z from 'zod';
import { useAuth, ProfileUpdateParams } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import AppLayout from '@/components/layout/AppLayout';

// Form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional(),
  avatarUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || user?.email || '',
      avatarUrl: profile?.avatarUrl || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Create a ProfileUpdateParams object from the form data
      const updateParams: ProfileUpdateParams = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
      };

      await updateProfile(updateParams);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/avatar.jpg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">Update Profile</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
