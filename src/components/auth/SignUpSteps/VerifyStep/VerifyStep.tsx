import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Car, User, FileText, CheckCircle2, ArrowRight, Loader2, IdCard, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifyStepProps {
  verificationMethod: "vin" | "plate" | null;
  vin: string;
  licensePlate: string;
  insuranceProvider: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  ssn: string;
  driverLicenseFile: File | null;
  paystubFile: File | null;
  carInsuranceFile: File | null;
  isLoading: boolean;
  uploadingDocs: boolean;
  onVerificationMethodChange: (method: "vin" | "plate" | null) => void;
  onVinChange: (value: string) => void;
  onLicensePlateChange: (value: string) => void;
  onInsuranceProviderChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onSsnChange: (value: string) => void;
  onDriverLicenseFileChange: (file: File | null) => void;
  onPaystubFileChange: (file: File | null) => void;
  onCarInsuranceFileChange: (file: File | null) => void;
  onSkip: () => void;
  onContinue: () => void;
}

export function VerifyStep({
  verificationMethod,
  vin,
  licensePlate,
  insuranceProvider,
  fullName,
  address,
  phoneNumber,
  ssn,
  driverLicenseFile,
  paystubFile,
  carInsuranceFile,
  isLoading,
  uploadingDocs,
  onVerificationMethodChange,
  onVinChange,
  onLicensePlateChange,
  onInsuranceProviderChange,
  onFullNameChange,
  onAddressChange,
  onPhoneNumberChange,
  onSsnChange,
  onDriverLicenseFileChange,
  onPaystubFileChange,
  onCarInsuranceFileChange,
  onSkip,
  onContinue,
}: VerifyStepProps) {
  const driverLicenseInputRef = useRef<HTMLInputElement>(null);
  const paystubInputRef = useRef<HTMLInputElement>(null);
  const carInsuranceInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="animate-scale-in">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Shield className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">Verify Your Information</CardTitle>
        <CardDescription className="text-sm">
          Complete verification to unlock full access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vehicle Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm text-foreground">Vehicle (Optional)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onVerificationMethodChange("vin")}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-all",
                verificationMethod === "vin"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/30"
              )}
            >
              <p className="font-medium text-sm text-foreground">VIN</p>
              <p className="text-xs text-muted-foreground">17-char ID</p>
            </button>
            <button
              onClick={() => onVerificationMethodChange("plate")}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-all",
                verificationMethod === "plate"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/30"
              )}
            >
              <p className="font-medium text-sm text-foreground">Plate</p>
              <p className="text-xs text-muted-foreground">License #</p>
            </button>
          </div>
          
          {verificationMethod === "vin" && (
            <Input
              placeholder="Enter your 17-character VIN"
              value={vin}
              onChange={(e) => onVinChange(e.target.value)}
              maxLength={17}
            />
          )}
          
          {verificationMethod === "plate" && (
            <Input
              placeholder="Enter your license plate"
              value={licensePlate}
              onChange={(e) => onLicensePlateChange(e.target.value)}
            />
          )}
          
          {verificationMethod && (
            <Input
              placeholder="Insurance Provider (optional)"
              value={insuranceProvider}
              onChange={(e) => onInsuranceProviderChange(e.target.value)}
            />
          )}
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm text-foreground">Personal Information</span>
          </div>
          
          <Input
            placeholder="Full Legal Name"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
          />
          
          <Input
            placeholder="Home Address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
            />
            <Input
              type="password"
              placeholder="SSN (Last 4)"
              maxLength={4}
              value={ssn}
              onChange={(e) => onSsnChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm text-foreground">Documents</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="file"
                ref={driverLicenseInputRef}
                accept="image/*,.pdf"
                onChange={(e) => onDriverLicenseFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => driverLicenseInputRef.current?.click()}
                className={cn(
                  "w-full rounded-lg border-2 border-dashed p-3 text-center transition-all",
                  driverLicenseFile
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/30"
                )}
              >
                {driverLicenseFile ? (
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-xs font-medium text-foreground truncate max-w-[60px]">{driverLicenseFile.name}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <IdCard className="h-5 w-5 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Driver's License</p>
                  </div>
                )}
              </button>
            </div>
            
            <div>
              <input
                type="file"
                ref={paystubInputRef}
                accept="image/*,.pdf"
                onChange={(e) => onPaystubFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => paystubInputRef.current?.click()}
                className={cn(
                  "w-full rounded-lg border-2 border-dashed p-3 text-center transition-all",
                  paystubFile
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/30"
                )}
              >
                {paystubFile ? (
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-xs font-medium text-foreground truncate max-w-[60px]">{paystubFile.name}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Receipt className="h-5 w-5 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Paystub</p>
                  </div>
                )}
              </button>
            </div>

            <div>
              <input
                type="file"
                ref={carInsuranceInputRef}
                accept="image/*,.pdf"
                onChange={(e) => onCarInsuranceFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => carInsuranceInputRef.current?.click()}
                className={cn(
                  "w-full rounded-lg border-2 border-dashed p-3 text-center transition-all",
                  carInsuranceFile
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/30"
                )}
              >
                {carInsuranceFile ? (
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="text-xs font-medium text-foreground truncate max-w-[60px]">{carInsuranceFile.name}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Car className="h-5 w-5 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Car Insurance</p>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onSkip}
            disabled={isLoading || uploadingDocs}
          >
            Skip
          </Button>
          <Button
            variant="accent"
            className="flex-1"
            onClick={onContinue}
            disabled={isLoading || uploadingDocs}
          >
            {(isLoading || uploadingDocs) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

