import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimStatusDto } from './dto/update-claim-status.dto';
import { Claim } from './entities/claim.entity';
import { ClaimDocument } from './entities/claim-document.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/role.decorator';

import { AddReviewNoteDto } from './dto/add-review-note.dto';
import { AssignAdjusterDto } from './dto/assign-adjuster.dto';
import { ClaimDecisionDto } from './dto/claim-decision.dto';
import { ClaimReview } from './entities/claim-review.entity';
import { ClaimActivityLog } from './entities/claim-activity-log.entity';


@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Post()
  create(
    @Body() createClaimDto: CreateClaimDto,
    @CurrentUser() user: { id: string; email: string; role: string },
  ): Promise<Claim> {
    return this.claimsService.create(createClaimDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Claim[]> {
    return this.claimsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateClaimStatusDto,
  ): Promise<Claim> {
    return this.claimsService.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('customer')
  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ClaimDocument> {
    return this.claimsService.uploadDocument(id, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id/documents')
  getClaimDocuments(
    @Param('id') id: string,
  ): Promise<ClaimDocument[]> {
    return this.claimsService.getClaimDocuments(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('documents/:documentId/download-url')
  generateDocumentDownloadUrl(
    @Param('documentId') documentId: string,
  ): Promise<{ downloadUrl: string }> {
    return this.claimsService.generateDocumentDownloadUrl(documentId);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post(':id/review-note')
addReviewNote(
  @Param('id') id: string,
  @Body() dto: AddReviewNoteDto,
  @CurrentUser() user: { id: string; email: string; role: string },
): Promise<ClaimReview> {
  return (this.claimsService as any).addReviewNote(id, dto.note, user.id);
}
  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post(':id/assign-adjuster')
assignAdjuster(
  @Param('id') id: string,
  @Body() dto: AssignAdjusterDto,
  @CurrentUser() user: { id: string; email: string; role: string },
): Promise<ClaimReview> {
  return this.claimsService.assignAdjuster(id, dto.adjusterName, user.id);
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post(':id/approve')
approveClaim(
  @Param('id') id: string,
  @Body() dto: ClaimDecisionDto,
  @CurrentUser() user: { id: string; email: string; role: string },
): Promise<Claim> {
  return this.claimsService.approveClaim(id, dto.note, user.id);
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post(':id/reject')
rejectClaim(
  @Param('id') id: string,
  @Body() dto: ClaimDecisionDto,
  @CurrentUser() user: { id: string; email: string; role: string },
): Promise<Claim> {
  return this.claimsService.rejectClaim(id, dto.note, user.id);
}
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get(':id/activity-timeline')
getClaimActivityTimeline(
  @Param('id') id: string,
): Promise<ClaimActivityLog[]> {
  return this.claimsService.getClaimActivityTimeline(id);
}
}