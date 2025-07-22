import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, Info } from 'lucide-react';
import { KeywordMatcher } from '@/lib/keyword-matcher';

interface JobRoleInputProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

const keywordMatcher = new KeywordMatcher();

export function JobRoleInput({ selectedRole, onRoleChange, disabled }: JobRoleInputProps) {
  const jobRoles = keywordMatcher.getAllJobRoles();

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Briefcase className="text-primary mr-2" size={20} />
          Target Job Role
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="jobRole" className="text-sm font-medium text-foreground">
              Select or enter job role
            </Label>
            <Select 
              value={selectedRole} 
              onValueChange={onRoleChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-muted-foreground">
              Select the role you're applying for to get personalized keyword suggestions and scoring.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
