<?php

namespace Database\Seeders;

use App\Models\WebsiteSetting;
use App\Models\HomepageSlider;
use App\Models\Announcement;
use Illuminate\Database\Seeder;

class WebsiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Website Settings
        $settings = [
            [
                'key' => 'college_name',
                'value' => 'Gautam Budha Mahila College, Gaya',
                'type' => 'text',
            ],
            [
                'key' => 'college_name_hindi',
                'value' => 'गौतम बुद्ध महिला महाविद्यालय, गयाजी',
                'type' => 'text',
            ],
            [
                'key' => 'college_subtitle',
                'value' => 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001',
                'type' => 'text',
            ],
            [
                'key' => 'logo_path',
                'value' => null, // null means use default logo image in frontend asset
                'type' => 'image',
            ],
            [
                'key' => 'primary_color',
                'value' => '#0b1b3d',
                'type' => 'color',
            ],
            [
                'key' => 'secondary_color',
                'value' => '#cc0000',
                'type' => 'color',
            ],
            [
                'key' => 'accent_color',
                'value' => '#eab308',
                'type' => 'color',
            ],
            [
                'key' => 'navbar_bg',
                'value' => '#0b1b3d',
                'type' => 'color',
            ],
            [
                'key' => 'hero_bg',
                'value' => '#990000',
                'type' => 'color',
            ],
            [
                'key' => 'font_family',
                'value' => 'Inter',
                'type' => 'text',
            ],
            [
                'key' => 'button_style',
                'value' => 'rounded', // rounded, rounded-full, rounded-none
                'type' => 'text',
            ],
            [
                'key' => 'address',
                'value' => 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001',
                'type' => 'text',
            ],
            [
                'key' => 'phone',
                'value' => '0631-2220642',
                'type' => 'text',
            ],
            [
                'key' => 'email',
                'value' => 'info@gbmcollegegaya.org',
                'type' => 'text',
            ],
            [
                'key' => 'vc_name',
                'value' => 'Prof. (Dr.) Dilip Kumar Kesari',
                'type' => 'text',
            ],
            [
                'key' => 'vc_designation',
                'value' => 'Vice Chancellor, Magadh University',
                'type' => 'text',
            ],
            [
                'key' => 'vc_message',
                'value' => 'Welcome to Gautam Budha Mahila College. Education is not just about loading minds with facts, it is about sparking a flame of scientific inquiry. We strive to provide our students with the resource support they need to become responsible global citizens and leaders in their chosen professions.',
                'type' => 'text',
            ],
            [
                'key' => 'vc_image_path',
                'value' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
                'type' => 'text',
            ],
            [
                'key' => 'principal_name',
                'value' => 'Prof. (Dr.) Seema Patel',
                'type' => 'text',
            ],
            [
                'key' => 'principal_designation',
                'value' => 'Principal, Gautam Budha Mahila College',
                'type' => 'text',
            ],
            [
                'key' => 'principal_message',
                'value' => 'At Gautam Budha Mahila College, we have established a culture of academic rigor and student achievements. With a focus on research, modern laboratories, and expert guidance, our campus continues to be the top choice for students looking to excel in science and computer applications.',
                'type' => 'text',
            ],
            [
                'key' => 'principal_image_path',
                'value' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
                'type' => 'text',
            ],
            [
                'key' => 'patron_name',
                'value' => 'Dr. Sunita Sharma',
                'type' => 'text',
            ],
            [
                'key' => 'patron_designation',
                'value' => 'Patron, Gautam Budha Mahila College',
                'type' => 'text',
            ],
            [
                'key' => 'patron_message',
                'value' => 'It is an honor to lead this institution. We have structured a syllabus support framework, dynamic co-curricular activities, and sports events to ensure that education is holistic, enjoyable, and creates highly employable graduates.',
                'type' => 'text',
            ],
            [
                'key' => 'patron_image_path',
                'value' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop',
                'type' => 'text',
            ],
            [
                'key' => 'stats_years',
                'value' => '20',
                'type' => 'text',
            ],
            [
                'key' => 'stats_programs',
                'value' => '18',
                'type' => 'text',
            ],
            [
                'key' => 'stats_students',
                'value' => '3500',
                'type' => 'text',
            ],
            [
                'key' => 'stats_faculty',
                'value' => '80',
                'type' => 'text',
            ],
            [
                'key' => 'affiliation_name',
                'value' => 'Magadh University',
                'type' => 'text',
            ],
            [
                'key' => 'affiliation_logo_path',
                'value' => null,
                'type' => 'image',
            ],
        ];

        foreach ($settings as $setting) {
            WebsiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value'], 'type' => $setting['type']]
            );
        }

        // 2. Seed Homepage Sliders
        $sliders = [
            [
                'title' => 'TENTH CONVOCATION',
                'subtitle' => 'Magadh University, Bodh Gaya',
                'caption' => 'GOLD MEDALIST',
                'description' => 'Empowering students through knowledge, academic excellence, and state-of-the-art practical research labs.',
                'image_path' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
                'button_text' => 'Apply Online 2026',
                'button_link' => '/admission?tab=apply',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'ACADEMIC EXCELLENCE',
                'subtitle' => 'Gautam Budha Mahila College',
                'caption' => 'TOPPERS CONGRATULATIONS',
                'description' => 'Our students continue to secure gold medals in Magadh University boards.',
                'image_path' => 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
                'button_text' => 'Apply Online 2026',
                'button_link' => '/admission?tab=apply',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'INFRASTRUCTURE & LABS',
                'subtitle' => 'Modern Zoology & Physics Labs',
                'caption' => 'STATE-OF-THE-ART FACILITIES',
                'description' => 'State-of-the-art practical research labs with modern equipments.',
                'image_path' => 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop',
                'button_text' => 'Apply Online 2026',
                'button_link' => '/admission?tab=apply',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        // Clear existing to avoid duplicate seeds during testing
        HomepageSlider::truncate();

        foreach ($sliders as $slider) {
            HomepageSlider::create($slider);
        }

        // 3. Seed Announcements
        $announcements = [
            '✨ Welcome to Gautam Budha Mahila College, Gaya - Admissions Open for Session 2026-27!',
            '📅 Digital Detox - Women\'s Day Notice: Seminar scheduled for next Monday.',
            '🏆 Congratulations to our Gold Medalist students in Magadh University exams!',
            '📚 CIA Examination Results and Academic Calendar 2026 are now available for download.',
        ];

        Announcement::truncate();

        foreach ($announcements as $index => $text) {
            Announcement::create([
                'text' => $text,
                'sort_order' => $index + 1,
                'is_active' => true,
            ]);
        }
    }
}
