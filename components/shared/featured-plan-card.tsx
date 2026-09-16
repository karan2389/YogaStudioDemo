"use client";

import { useEffect, useState } from "react";
import { PlanCard } from "@/components/shared/plan-card";
import { membershipPlans } from "@/data/mock-data";
import { getAdminMembershipPlans } from "@/services/admin-storage";
import type { MembershipPlan } from "@/types/domain";

const seed = membershipPlans.find((plan) => plan.featured) ?? membershipPlans[0];

export function FeaturedPlanCard() {
  const [plan, setPlan] = useState<MembershipPlan>(seed);
  useEffect(() => { const load = () => { const plans = getAdminMembershipPlans(); setPlan(plans.find((item) => item.featured) ?? plans[0] ?? seed); }; load(); window.addEventListener("ananda-demo-change", load); return () => window.removeEventListener("ananda-demo-change", load); }, []);
  return <PlanCard plan={plan} />;
}
