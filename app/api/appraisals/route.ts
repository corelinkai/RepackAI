import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabase } from '@/lib/supabase';

// GET /api/appraisals - Fetch user's appraisals
export async function GET(request: NextRequest) {
  try {
    // Get session to verify user is logged in
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get userId from session
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userData.id;

    // Fetch user's appraisals
    const { data: appraisals, error } = await supabase
      .from('appraisals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch appraisals' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appraisals: appraisals || [],
    });
  } catch (error) {
    console.error('Get appraisals error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appraisals' },
      { status: 500 }
    );
  }
}

// DELETE /api/appraisals?id=xxx - Delete a specific appraisal
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const appraisalId = searchParams.get('id');

    if (!appraisalId) {
      return NextResponse.json(
        { success: false, error: 'Appraisal ID required' },
        { status: 400 }
      );
    }

    // Get userId from session
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the appraisal (only if it belongs to the user)
    const { error } = await supabase
      .from('appraisals')
      .delete()
      .eq('id', appraisalId)
      .eq('user_id', userData.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete appraisal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appraisal deleted successfully',
    });
  } catch (error) {
    console.error('Delete appraisal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete appraisal' },
      { status: 500 }
    );
  }
}
